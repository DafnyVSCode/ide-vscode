"use strict";
import * as vscode from "vscode";

import { ServerInitializer } from "./dafnyLanguageServerStartup/_DafnyLanguageServerStartupModule";
import { ExecutionCapabilities } from "./localExecution/_LocalExecutionModule";
import { Warning, Error } from "./stringRessources/_StringRessourcesModule";

/**
 * This is the plugins entry point (the "main" function)
 * It checks for the right way to start the language server (mono or not mono on windows)
 * and starts the language server with the DafnyLanguageServer class.
 */
export function activate(extensionContext: vscode.ExtensionContext) {
  if (vscode.workspace.workspaceFolders === undefined) {
    vscode.window.showWarningMessage(Warning.NoWorkspace);
  }

  const exeCapabilities = new ExecutionCapabilities();
  if (!exeCapabilities.hasSupportedMonoVersion()) {
    // Promt the user to install Mono and stop extension execution.
    vscode.window
      .showErrorMessage(
        Error.NoSupportedMono,
        Error.ConfigureMonoExecutable,
        Error.GetMono
      )
      .then((selection) => {
        exeCapabilities.getMono(selection);
      });
    return;
  }

  const dafnyLanguageServer = new ServerInitializer(extensionContext);
  dafnyLanguageServer.startLanguageServer();
  dafnyLanguageServer.registerServerRestartCommand();
}
