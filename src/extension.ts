import * as vscode from "vscode";
import simpleGit, { SimpleGit } from "simple-git";
import * as path from "path";

import CallGPT from "./callGPT";
import CallGemini from "./callGemini";

export function activate(context: vscode.ExtensionContext) {
  let response: string = "";

  let disposable = vscode.commands.registerCommand(
    "undefined_publisher.gitwit.extension.generateCommitMessage",
    async () => {
      const config = vscode.workspace.getConfiguration(
        "undefined_publisher.gitwit"
      );
      let selectedModel = config.get("selectedModel", "");
      let mainModel = config.get("mainModel", "");
      let apiKey = config.get("apiKey", "");
      let error = false;
      vscode.window
        .withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Generating Commit Message",
            cancellable: true,
          },
          async (progress, token) => {
            progress.report({
              increment: 0,
              message:
                "Sweeping through the workspace for uncommitted treasures... 🧹",
            });
            const git: SimpleGit = simpleGit(
              vscode.workspace.workspaceFolders?.[0].uri.fsPath || ""
            );

            try {
              const gitStatus = await git.status();

              const modifiedFiles = gitStatus.modified;
              const createdFile = gitStatus.created;
              const deletedFiles = gitStatus.deleted;

              let allDiffs = `Modified files: ${modifiedFiles.join(
                ", "
              )}\nAdded files: ${createdFile.join(
                ", "
              )}\nDeleted files: ${deletedFiles.join(", ")}\n\n`;

              for (const file of modifiedFiles) {
                const diff = await git.diff([file]);
                allDiffs += `\n--- ${file} ---\n${diff}\n`;
              }
              for (const file of createdFile) {
                const fileExtension = path.extname(file).toLowerCase();

                // Only log the file path for image file types (.jpeg, .jpg, .png)
                if ([".jpeg", ".jpg", ".png"].includes(fileExtension)) {
                  allDiffs += `\n+++ ${file} +++\n`;
                } else {
                  // For non-image files, read the content and append it
                  const filePath = path.join(
                    vscode.workspace.workspaceFolders?.[0].uri.fsPath || "",
                    file
                  );
                  const fileContent = await vscode.workspace.fs.readFile(
                    vscode.Uri.file(filePath)
                  );
                  const contentStr = fileContent.toString();
                  allDiffs += `\n+++ ${file} +++\n${contentStr}\n`;
                }
              }
              progress.report({
                increment: 40,
                message: "Got 'em! Stitching changes together... 🧵",
              });
              // const fileName = path.join(
              //   vscode.workspace.workspaceFolders?.[0].uri.fsPath || "",
              //   "Uncommitted_Changes.txt"
              // );
              // fs.writeFileSync(fileName, allDiffs);
              progress.report({
                increment: 50,
                message: "Wiring neurons and making connections... ⚡",
              });
              console.log("mainModel", mainModel);
              if (mainModel === "ChatGPT") {
                if (apiKey === "") {
                  error = true;
                  vscode.window
                    .showErrorMessage(
                      "Please enter your API Key in the extension settings."
                    )
                    .then(() => {
                      // Open the settings for entering the API key
                      vscode.commands.executeCommand(
                        "workbench.action.openSettings",
                        "undefined_publisher.gitwit.apiKey"
                      );
                    });
                  return;
                }
                response =
                  (await CallGPT({
                    diffs: allDiffs,
                    model: selectedModel,
                    apikey: apiKey,
                  })) || "";
                progress.report({
                  increment: 100,
                  message: "Wrapping it up... just a few more moments! 🎁",
                });
              } else if (mainModel === "Gemini") {
                if (apiKey === "") {
                  error = true;
                  vscode.window
                    .showErrorMessage(
                      "Please enter your API Key in the extension settings."
                    )
                    .then(() => {
                      // Open the settings for entering the API key
                      vscode.commands.executeCommand(
                        "workbench.action.openSettings",
                        "undefined_publisher.gitwit.apiKey"
                      );
                    });
                  return;
                }
                response = await CallGemini({
                  diffs: allDiffs,
                  modelName: selectedModel,
                  apikey: apiKey,
                });
                progress.report({
                  increment: 100,
                  message: "Wrapping it up... just a few more moments! 🎁",
                });
              } else {
                error = true;
                vscode.window
                  .showErrorMessage(
                    "Please select a model from the extension settings."
                  )
                  .then(() => {
                    vscode.commands.executeCommand(
                      "workbench.action.openSettings",
                      "undefined_publisher.gitwit.mainModel"
                    );
                  });
              }

              console.log(response);
            } catch (error: any) {
              vscode.window.showErrorMessage(
                "Error fetching uncommitted changes: " + error
              );
              console.error(error);
            }
          }
        )
        .then(async () => {
          if (!error) {
            const selection = await vscode.window.showInformationMessage(
              "Commit message crafted with care... ready to push! 🚀",
              "Copy to Clipboard"
            );

            if (
              selection !== undefined &&
              selection === "Copy to Clipboard" &&
              response
            ) {
              await vscode.env.clipboard.writeText(response);
              vscode.window.showInformationMessage(`Copied to Clipboard`, {
                modal: true,
              });
            }
          }
        });
    }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "undefined_publisher.gitwit.extension.welcome",
      () => {
        vscode.commands.executeCommand(
          `workbench.action.openWalkthrough`,
          "undefined_publisher.gitwit",
          false
        );
      }
    )
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "undefined_publisher.gitwit.extension.selectModel",
      async function () {
        const Model = await vscode.window.showQuickPick(["ChatGPT", "Gemini"], {
          placeHolder: "Select the AI model of your choice",
        });

        if (Model === "ChatGPT") {
          const pickedModel = await vscode.window.showQuickPick(
            [
              "gpt-4o",
              "gpt-4o-mini",
              "o1-preview",
              "o1-mini",
              "gpt-4-turbo",
              "gpt-4",
              "gpt-3.5-turbo",
            ],
            {
              placeHolder: "Select the version of ChatGPT you want to use",
            }
          );

          if (pickedModel) {
            vscode.workspace
              .getConfiguration()
              .update(
                "undefined_publisher.gitwit.selectedModel",
                pickedModel,
                vscode.ConfigurationTarget.Global
              );

            vscode.workspace
              .getConfiguration()
              .update(
                "undefined_publisher.gitwit.mainModel",
                Model,
                vscode.ConfigurationTarget.Global
              );
            console.log("Model", Model);
            vscode.window.showInformationMessage(
              `You have selected ${pickedModel} from ${Model} as your AI model.`
            );
          }
        }

        if (Model === "Gemini") {
          const pickedModel = await vscode.window.showQuickPick(
            ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"],
            {
              placeHolder: "Select the version of Gemini you want to use",
            }
          );

          if (pickedModel) {
            vscode.workspace
              .getConfiguration()
              .update(
                "undefined_publisher.gitwit.selectedModel",
                pickedModel,
                vscode.ConfigurationTarget.Global
              );
            vscode.workspace
              .getConfiguration()
              .update(
                "undefined_publisher.gitwit.mainModel",
                Model,
                vscode.ConfigurationTarget.Global
              );
            vscode.window.showInformationMessage(
              `You have selected ${pickedModel} from ${Model} as your AI model.`
            );
          }
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "undefined_publisher.gitwit.extension.apikey",
      async function () {
        const inputApiKey = await vscode.window.showInputBox({
          prompt: "Enter your API Key",
          password: true,
        });

        if (inputApiKey) {
          vscode.workspace
            .getConfiguration()
            .update(
              "undefined_publisher.gitwit.apiKey",
              inputApiKey,
              vscode.ConfigurationTarget.Global
            );
          vscode.window.showInformationMessage("API Key saved.");
        }
      }
    )
  );
}

export function deactivate() {}
