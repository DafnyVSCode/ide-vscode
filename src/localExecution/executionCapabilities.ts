"use strict";
import { execFileSync } from "child_process";
import * as os from "os";
import { log } from "util";

import { workspace, commands, window, Uri } from "../ideApi/_IdeApi";
import {
  Config,
  EnvironmentConfig,
  Error,
  VSCodeCommandStrings,
} from "../stringResources/_StringResourcesModule";

import { IExecutionCapabilities } from "./IExecutionCapabilities";

/**
 * Check for supported capabilities (dotnet runtime, Dafny)
 */
export class ExecutionCapabilities implements IExecutionCapabilities {
  private config = workspace.getConfiguration(EnvironmentConfig.Dafny);
  public hasSupportedDotnetVersion(): boolean {
    const dotnetExecutable =
      this.config.get<string>(Config.DotnetExecutablePath) ||
      EnvironmentConfig.Dotnet;

    try {
      const dotnetRuntimeListOutput = execFileSync(dotnetExecutable, [
        EnvironmentConfig.DotnetListRuntimes,
      ]);
      return EnvironmentConfig.DotnetSupportedRuntimePattern.test(
        dotnetRuntimeListOutput
      );
    } catch (exeception) {
      log(Error.DotnetBinaryNotExecuted);
      return false;
    }
  }

  public getDotnet(dotnetVersionSelection: string): void {
    if (dotnetVersionSelection === Error.GetDotnet) {
      commands.executeCommand(
        VSCodeCommandStrings.Open,
        Uri.parse(Error.GetDotnetUri)
      );
      let restartMessage;
      if (os.type() === "Darwin") {
        restartMessage = Error.RestartMacAfterDotnetInstall;
      } else {
        restartMessage = Error.RestartCodeAfterDotnetInstall;
      }
      window.showWarningMessage(restartMessage);
    }

    if (dotnetVersionSelection === Error.ConfigureDotnetExecutable) {
      commands.executeCommand(VSCodeCommandStrings.ConfigSettings);
    }
  }
}
