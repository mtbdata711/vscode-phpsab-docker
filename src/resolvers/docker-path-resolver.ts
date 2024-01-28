/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2022 Matthew Benge. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ResourceSettings } from "../interfaces/resource-settings";
import { Logger } from "../logger";
export class DockerPathResolver {
    private filePath: string;
    private config: ResourceSettings;
    private pathSeparator: string;
    private logger: Logger;

    constructor(filePath: string, config: ResourceSettings, logger: Logger) {
        this.filePath = filePath;
        this.config = config;
        this.pathSeparator = /^win/.test(process.platform) ? "\\" : "/";
        this.logger = logger;
    }

    // resolve docker path to local path from document.uri.fsPath
    public resolveDocker() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        const dockerPath = filePath.replace(workspaceRoot, dockerWorkspaceRoot);
        this.logger.logInfo(`DOCKER: Resolved docker path: ${dockerPath}`);
        return dockerPath;
    }

    // resolve local path to docker path from document.uri.fsPath
    public resolveLocal() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        const localPath = filePath.replace(dockerWorkspaceRoot, workspaceRoot);
        this.logger.logInfo(`DOCKER: Resolved local path: ${localPath}`);
        return localPath;
    }

    // resolve local path to docker path from raw path
    public resolveDockerRaw() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        const dockerPath = filePath
            .split(pathSeparator)
            .join("/")
            .replace(workspaceRoot, dockerWorkspaceRoot);
        this.logger.logInfo(
            `DOCKER: Resolved docker path from raw: ${dockerPath}`
        );
        return dockerPath;
    }

    // resolve docker path to local path from raw path
    public resolveLocalRaw() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        const localPath = filePath
            .split("/")
            .join(pathSeparator)
            .replace(dockerWorkspaceRoot, workspaceRoot);
        this.logger.logInfo(`DOCKER: Resolved local path: ${localPath}`);
        return localPath;
    }
}