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

    public resolveDocker() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        let dockerPath;
        if (filePath.includes(workspaceRoot)) {
            dockerPath = filePath.replace(workspaceRoot, dockerWorkspaceRoot);
        } else {
            const normalizedWorkspaceRoot = workspaceRoot.split(pathSeparator).join("/");
            dockerPath = filePath
                .split(pathSeparator)
                .join("/")
                .replace(normalizedWorkspaceRoot, dockerWorkspaceRoot);
        }
        this.logger.logInfo(`DOCKER: Resolved docker path: ${dockerPath}`);
        return dockerPath;
    }
    
    public resolveLocal() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        let localPath;
        if (filePath.includes(dockerWorkspaceRoot)) {
            localPath = filePath.replace(dockerWorkspaceRoot, workspaceRoot);
        } else {
            const normalizedDockerWorkspaceRoot = dockerWorkspaceRoot.split("/").join(pathSeparator);
            localPath = filePath
                .split("/")
                .join(pathSeparator)
                .replace(normalizedDockerWorkspaceRoot, workspaceRoot);
        }
        this.logger.logInfo(`DOCKER: Resolved local path: ${localPath}`);
        return localPath;
    }

    
}