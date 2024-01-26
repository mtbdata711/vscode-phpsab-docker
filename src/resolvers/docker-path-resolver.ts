/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2022 Matthew Benge. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ResourceSettings } from "../interfaces/resource-settings";
import * as path from "path";
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
        let { filePath } = this;
        const normalisedPath = filePath.split(this.pathSeparator).join("/");
        return normalisedPath.replace(workspaceRoot, dockerWorkspaceRoot);
    }

    public resolveLocal(){
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        let { filePath } = this;
        const normalisedPath = filePath.split("/").join(this.pathSeparator);
        return normalisedPath.replace(dockerWorkspaceRoot, workspaceRoot);
    }
}