/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 Samuel Hilson. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";

export interface ResourceSettings {
    useFilepath: boolean;
    containerExec: string;
    workspaceRoot: string;
    fixerEnable: boolean;
    fixerArguments: string[];
    snifferEnable: boolean;
    snifferArguments: string[];
    executablePathCBF: string;
    executablePathCS: string;
    composerJsonPath: string;
    standard: string | null;
    autoRulesetSearch: boolean;
    allowedAutoRulesets: string[];
    dockerContainer: string;
    dockerWorkspaceRoot: string;
    dockerEnabled: boolean;
    dockerExecutablePathCBF?: string;
    dockerExecutablePathCS?: string;
}
