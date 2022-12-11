/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2022 Matthew Benge. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ResourceSettings } from "../interfaces/resource-settings";

export class DockerPathResolver {

    private filePath: string;
    private config: ResourceSettings;

    constructor(
        filePath: string,
        config: ResourceSettings,
    ){
        this.filePath = filePath;
        this.config = config;
    }

    public resolveDocker(){
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        return filePath.replace(workspaceRoot, dockerWorkspaceRoot);
    }

    public resolveLocal(){
        const { dockerWorkspaceRoot, workspaceRoot } = this.config;
        const { filePath } = this;
        return filePath.replace(dockerWorkspaceRoot, workspaceRoot);
    }

}