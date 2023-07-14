
# PHP Sniffer & Beautifier Docker

This extension is a fork of [PHP Sniffer & Beautifier for VS Code](https://github.com/valeryan/vscode-phpsab)

This plugin for [Visual Studio Code](https://code.visualstudio.com/) allows you to view linting errors and run code fixes from [phpcs & phpcbf](http://pear.php.net/package/PHP_CodeSniffer/) running in a Docker container within your local VS Code editor.

This is useful for cases where you are developing in a Docker container but do not want to run / are not able to run a [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers).

This extension maintains compatibility with [PHP Sniffer & Beautifier for VS Code](https://github.com/valeryan/vscode-phpsab) with some code tweaks to extend it to work with Docker.

## Quick start

 - Add a `.vscode` directory to your project if it does not already exist
 - Create a `settings.json` file within your `.vscode` directory or append extension settings if the file already exists
 - Insert the following settings:

```
{
	"phpsab.docker.dockerEnabled": true,
	"phpsab.docker.dockerContainer": "<container_name or container_id of running Docker container>",
	"phpsab.docker.dockerWorkspaceRoot": "<path to your projects root directory within the Docker container>"
}
```

For example, if you are developing a WordPress plugin at `/home/<user>/Projects/MyPlugin` on your local system which is mounted to `/var/www/html/wp-content/plugins/MyPlugin` inside a Docker container named `wordpress` you could use the following settings:
```
{
	"phpsab.docker.dockerEnabled": true,
	"phpsab.docker.dockerContainer": "wordpress",
	"phpsab.docker.dockerWorkspaceRoot": "/var/www/html/wp-content/plugins/MyPlugin"
}
```

## Docker settings

To enable linting from within a Docker container the extension provides a number of settings that need to be added to your `settings.json` file within the `.vscode` directory of your VS Code workspace.  

| Setting | Description | Default Value 
|--|--|--|
| phpsab.docker.dockerEnabled | Whether to enable Docker functionality  | false
|phpsab.docker.dockerContainer| Name of the running Docker container for the current project | ""
|phpsab.docker.dockerWorkspaceRoot| Path to your current working directory within your Docker container | ""
|phpsab.docker.dockerExecutablePathCBF| (Optional) phpcbf executable path within your Docker container | ""
|phpsab.docker.dockerExecutablePathCS| (Optional) phpcs executable path within your Docker container | ""

This extension assumes that you are intending to run phpcs & phpcbf within the Docker container of the project you are currently developing in. 

Under the hood, all phpcs and phpcbf commands are run within the Docker container listed in the `phpsab.docker.dockerContainer` setting and then forwarded to your local files.

As such, it is recommended that these are added in each project that you work on in a `.vscode` directory rather than as a global setting.

For documentation on adding a `setting.json` file to your Workspace using the `.vscode` directory see the [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings#_workspace-settingsjson-location) docs for VS Code.

## PHP Sniffer & Beautifier Settings

Setting properties have been tweaked for this plugin. See changed property names for PHP Sniffer & Beautifier Docker below.

| phpsab setting | phpsab-docker setting | Default value |
|--|--|--
| phpsab.fixerEnable  |phpsab.docker.fixerEnable |  true
| phpsab.fixerArguments | phpsab.docker.fixerArguments | []
| phpsab.executablePathCBF | phpsab.docker.executablePathCBF | null
| phpsab.executablePathCS | phpsab.docker.executablePathCS | null
| phpsab.composerJsonPath | phpsab.docker.composerJsonPath | composer.json
| phpsab.standard | phpsab.docker.standard | null
| phpsab.autoRulesetSearch | phpsab.docker.autoRulesetSearch | true
|phpsab.allowedAutoRulesets | phpsab.docker.allowedAutoRulesets | [ ".phpcs.xml", ".phpcs.xml.dist", "phpcs.xml", "phpcs.xml.dist", "phpcs.ruleset.xml", "ruleset.xml" ]
| phpsab.snifferEnable | phpsab.docker.snifferEnable | true
|phpsab.snifferArguments | phpsab.docker.snifferArguments | []
|phpsab.snifferMode|phpsab.docker.snifferMode|"onSave"
|phpsab.snifferTypeDelay|phpsab.docker.snifferTypeDelay|250
|phpsab.snifferShowSources|phpsab.docker.snifferShowSources|false
|phpsab.debug|phpsab.docker.debug|false


For full documentation, please see the docs in the original  [PHP Sniffer & Beautifier for VS Code](https://github.com/valeryan/vscode-phpsab) extension repo.

## Acknowledgements

  

This extension is based off of the  [PHP Sniffer & Beautifier for VS Code](https://github.com/valeryan/vscode-phpsab) extension.