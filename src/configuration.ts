/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 Samuel Hilson. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";

import { SpawnSyncOptions } from "child_process";
import * as spawn from "cross-spawn";
import * as fs from "fs";
import * as path from "path";
import { Uri, workspace, WorkspaceConfiguration } from "vscode";
import { ResourceSettings } from "./interfaces/resource-settings";
import { Settings } from "./interfaces/settings";
import { Logger, LogLevel } from "./logger";
import { DockerPathResolver } from "./resolvers/docker-path-resolver";
import { PathResolver } from "./resolvers/path-resolver";

export class Configuration {
    debug: boolean;
    config: WorkspaceConfiguration;

    constructor(private logger: Logger) {
        this.config = workspace.getConfiguration("phpsab.docker");
        this.debug = this.config.get("debug", false);

        let logLevel: LogLevel = this.debug ? "INFO" : "ERROR";
        this.logger.setOutputLevel(logLevel);
    }

    /**
     * Load from configuration
     */
    public async load() {
        if (!workspace.workspaceFolders) {
            throw new Error("Unable to load configuration.");
        }

        const resourcesSettings: Array<ResourceSettings> = [];

        for (
            let index = 0;
            index < workspace.workspaceFolders.length;
            index++
        ) {
            const resource = workspace.workspaceFolders[index].uri;
            const config = workspace.getConfiguration(
                "phpsab.docker",
                resource
            );
            const rootPath = this.resolveRootPath(resource);
            let settings: ResourceSettings = {
                useFilepath: config.get("useFilepath", false),
                containerExec: config.get("containerExec", "docker"),
                fixerEnable: config.get("fixerEnable", true),
                fixerArguments: config.get("fixerArguments", []),
                workspaceRoot: rootPath,
                executablePathCBF: config.get("executablePathCBF", ""),
                executablePathCS: config.get("executablePathCS", ""),
                composerJsonPath: config.get(
                    "composerJsonPath",
                    "composer.json"
                ),
                standard: config.get("standard", ""),
                autoRulesetSearch: config.get("autoRulesetSearch", true),
                allowedAutoRulesets: config.get("allowedAutoRulesets", [
                    ".phpcs.xml",
                    "phpcs.xml",
                    "phpcs.dist.xml",
                    "ruleset.xml",
                ]),
                snifferEnable: config.get("snifferEnable", true),
                snifferArguments: config.get("snifferArguments", []),
                dockerEnabled: config.get("dockerEnabled", false),
                dockerContainer: config.get("dockerContainer", ""),
                dockerWorkspaceRoot: config.get("dockerWorkspaceRoot", ""),
                dockerExecutablePathCBF: config.get(
                    "dockerExecutablePathCBF",
                    ""
                ),
                dockerExecutablePathCS: config.get(
                    "dockerExecutablePathCS",
                    ""
                ),
            };
            settings = await this.resolveCBFExecutablePath(settings);
            settings = await this.resolveCSExecutablePath(settings);
            settings = this.resolveDockerCBFExecutablePath(settings);
            settings = this.resolveDockerCSExecutablePath(settings);

            console.log({ settings });

            settings = await this.validate(
                settings,
                workspace.workspaceFolders[index].name
            );

            resourcesSettings.splice(index, 0, settings);
        }

        // update settings from config
        let settings: Settings = {
            resources: resourcesSettings,
            snifferMode: this.config.get("snifferMode", "onSave"),
            snifferShowSources: this.config.get("snifferShowSources", false),
            snifferTypeDelay: this.config.get("snifferTypeDelay", 250),
            debug: this.debug,
        };
        this.logger.logInfo("CONFIGURATION", settings);
        return settings;
    }

    /**
     * Attempt to find the root path for a workspace or resource
     * @param resource
     */
    private resolveRootPath(resource: Uri) {
        // try to get a valid folder from resource
        let folder = workspace.getWorkspaceFolder(resource);

        // one last safety check
        return folder ? folder.uri.fsPath : "";
    }

    /**
     * Get correct executable path from resolver
     * @param settings
     */
    protected async resolveCBFExecutablePath(
        settings: ResourceSettings
    ): Promise<ResourceSettings> {
        
        const { dockerEnabled, dockerExecutablePathCBF } = settings;

        if (dockerEnabled && typeof dockerExecutablePathCBF === "string" && dockerExecutablePathCBF.length > 0) {
            return settings;
        }

        if (settings.executablePathCBF === null) {
            let executablePathResolver = new PathResolver(settings, "phpcbf");
            settings.executablePathCBF = await executablePathResolver.resolve();
        } else if (
            !path.isAbsolute(settings.executablePathCBF) &&
            settings.workspaceRoot !== null
        ) {
            settings.executablePathCBF = path.join(
                settings.workspaceRoot,
                settings.executablePathCBF
            );
        }
        return settings;
    }

    /**
     * Get correct executable path from resolver
     * @param settings
     */
    protected async resolveCSExecutablePath(
        settings: ResourceSettings
    ): Promise<ResourceSettings> {

        const { dockerEnabled, dockerExecutablePathCS } = settings;

        if (dockerEnabled && typeof dockerExecutablePathCS === "string" && dockerExecutablePathCS.length > 0) {
            return settings;
        }

        if (settings.executablePathCS === null) {
            let executablePathResolver = new PathResolver(settings, "phpcs");
            settings.executablePathCS = await executablePathResolver.resolve();
        } else if (
            !path.isAbsolute(settings.executablePathCS) &&
            settings.workspaceRoot !== null
        ) {
            settings.executablePathCS = path.join(
                settings.workspaceRoot,
                settings.executablePathCS
            );
        }
        return settings;
    }

    protected resolveDockerCBFExecutablePath(
        settings: ResourceSettings
    ): ResourceSettings {
        const { dockerEnabled, dockerExecutablePathCBF, executablePathCBF } =
            settings;

        if(!dockerEnabled) {
            return settings;
        }

        if (dockerExecutablePathCBF === "") {
            settings.dockerExecutablePathCBF = new DockerPathResolver(
                executablePathCBF,
                settings,
                this.logger
            ).resolveDocker();
        }

        return settings;
    }

    protected resolveDockerCSExecutablePath(
        settings: ResourceSettings
    ): ResourceSettings {
        const { dockerEnabled, dockerExecutablePathCS, executablePathCS } =
            settings;

        if(!dockerEnabled) {
            return settings;
        }

        if (dockerExecutablePathCS === "") {
            settings.dockerExecutablePathCS = new DockerPathResolver(
                executablePathCS,
                settings,
                this.logger
            ).resolveDocker();
        }

        return settings;
    }

    private async validate(
        settings: ResourceSettings,
        resource: string
    ): Promise<ResourceSettings> {
        const {
            dockerEnabled,
            dockerExecutablePathCS,
            dockerExecutablePathCBF,
        } = settings;

        if (settings.snifferEnable) {
            if (
                dockerEnabled &&
                typeof dockerExecutablePathCS === "string" &&
                dockerExecutablePathCS.length > 0
            ) {
                settings.snifferEnable = await this.dockerExecutableExist(
                    dockerExecutablePathCS,
                    settings
                );
            } else {
                settings.snifferEnable = await this.executableExist(
                    settings.executablePathCS
                );
            }
        }

        if (settings.fixerEnable) {
            if (
                dockerEnabled &&
                typeof dockerExecutablePathCBF === "string" &&
                dockerExecutablePathCBF.length > 0
            ) {
                settings.fixerEnable = await this.dockerExecutableExist(
                    dockerExecutablePathCBF,
                    settings
                );
            } else {
                settings.fixerEnable = await this.executableExist(
                    settings.executablePathCBF
                );
            }
        }

        if (!settings.snifferEnable) {
            this.logger.logInfo(
                "The phpcs executable was not found for " + resource
            );
        }

        if (!settings.fixerEnable) {
            this.logger.logInfo(
                "The phpcbf executable was not found for " + resource
            );
        }

        this.logger.logInfo("VALIDATED", settings);

        return settings;
    }

    private async executableExist(path: string) {
        if (!path) {
            return false;
        }
        if (fs.existsSync(path)) {
            return true;
        }
        return false;
    }

    private async dockerExecutableExist(
        path: string,
        settings: ResourceSettings
    ) {
        if (!path) {
            return false;
        }

        const { workspaceRoot, dockerContainer, containerExec } = settings;

        const options: SpawnSyncOptions = {
            cwd: workspaceRoot !== null ? workspaceRoot : undefined,
            env: process.env,
            encoding: "utf8",
            input: undefined,
            shell: true,
        };

        const dockerCommand = [
            "exec",
            "-i",
            dockerContainer,
            "test",
            "-f",
            path,
            "&&",
            "echo",
            "1",
            "||",
            "echo",
            "0",
        ];

        const result = spawn.sync(containerExec, dockerCommand, options);
        return result.stdout.toString().trim() === "1";
    }
}
