import OpenAI from "openai";

const CallGPT = async ({
  diffs,
  model,
  apikey,
}: {
  diffs: string;
  model: string;
  apikey: string;
}) => {
  console.log("All diffs", diffs);

  console.log("Calling AI");

  const openai = new OpenAI({
    apiKey: apikey,
  });
  const completion = openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `You are a assistant who writes git commit messages follow the following guidelines strictly on how to write commit messages. A standard git commit message typically appears as follows:

<type>(<scope>): <subject>

The “type” field must be chosen from the options listed below:
build : Changes related to building the code (e.g. adding npm dependencies or external libraries).
chore: Changes that do not affect the external user (e.g. updating the .gitignore file or .prettierrc file).
feat: A new feature.
fix: A bug fix.
docs: Documentation a related changes.
refactor: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name).
perf: A code that improves performance style: A code that is related to styling.
test: Adding new test or making changes to existing test
The “scope” is optional
The “scope” field should be a noun that represents the part of the codebase affected by the commit.

For example, if the commit changes the login page, the scope could be “login”. If the commit affects multiple areas of the codebase, “global” or “all” could be used as the scope.

Example of a commit message:
feat(gallery): Remove redundant code

`,
      },
      {
        role: "user",
        content: diffs,
      },
    ],
  });
  console.log("Completion", completion);
  const response = (await completion).choices[0].message.content;

  return response;
};

export default CallGPT;
