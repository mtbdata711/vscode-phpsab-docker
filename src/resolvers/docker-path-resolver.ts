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
    private isWindows: boolean;

    constructor(filePath: string, config: ResourceSettings, logger: Logger) {
        this.filePath = filePath;
        this.config = config;
        this.logger = logger;
        this.isWindows = /^win/.test(process.platform);
    }

    // resolve docker path to local path from document.uri.fsPath
    public resolveDocker() {
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        let normalisedWorkspaceRoot = workspaceRoot;
        if(this.isWindows) {
            normalisedWorkspaceRoot = workspaceRoot.replace(/\\/g, "/").toLowerCase();
        }
        const dockerPath = filePath.replace(normalisedWorkspaceRoot, dockerWorkspaceRoot);
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
}