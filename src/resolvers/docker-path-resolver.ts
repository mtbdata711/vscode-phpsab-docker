/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2022 Matthew Benge. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ResourceSettings } from "../interfaces/resource-settings";
import { Logger } from "../logger";
export class DockerPathResolver {
    private filePath: string;
    private config: ResourceSettings;
    private logger: Logger;

    constructor(filePath: string, config: ResourceSettings, logger: Logger) {
        this.filePath = filePath;
        this.config = config;
        this.logger = logger;
    }

    public resolveDocker() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        let { filePath } = this;
        const normalisedWorkspaceRoot = DockerPathResolver.toPosixPath(workspaceRoot);
        const normalisedFilePath = DockerPathResolver.toPosixPath(filePath);
        const dockerPath = normalisedFilePath.replace(normalisedWorkspaceRoot, dockerWorkspaceRoot);
        this.logger.logInfo(`DOCKER: Resolved docker path: ${dockerPath}`);
        return dockerPath;
    }

    public resolveLocal() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        const localPath = filePath.replace(dockerWorkspaceRoot, workspaceRoot);
        this.logger.logInfo(`DOCKER: Resolved local path: ${localPath}`);
        return localPath;
    }

    static toPosixPath(path: string) {
        return path.replace(/\\/g, "/");
    }
}