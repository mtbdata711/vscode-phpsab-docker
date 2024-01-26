/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2022 Matthew Benge. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ResourceSettings } from "../interfaces/resource-settings";
export class DockerPathResolver {

    private filePath: string;
    private config: ResourceSettings;
    private pathSeparator: string;

    constructor(
        filePath: string,
        config: ResourceSettings,
    ){
        this.filePath = filePath;
        this.config = config;
        this.pathSeparator = /^win/.test(process.platform) ? "\\" : "/";
    }

    public resolveDocker(){
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        const normalisedPath = filePath.split(pathSeparator).join("/");
        return normalisedPath.replace(workspaceRoot, dockerWorkspaceRoot);
    }

    public resolveLocal(){
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath, pathSeparator } = this;
        const normalisedPath = filePath.split("/").join(pathSeparator);
        return normalisedPath.replace(dockerWorkspaceRoot, workspaceRoot);
    }
}