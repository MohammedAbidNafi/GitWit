# Gitwit: AI-Powered Git Commit Message Generator

Gitwit is a VS Code extension that uses the power of AI to generate meaningful and concise Git commit messages based on the changes you make in your repository. Save time, eliminate writer’s block, and maintain consistent commit history with Gitwit!

---

## Features

- **AI-Generated Commit Messages:** Automatically generate commit messages tailored to your code changes.
- **Customizable Suggestions:** Edit and refine AI-generated suggestions directly within the extension.
- **Seamless Git Integration:** Works seamlessly with your Git workflow.
- **Clipboard Integration:** Generated messages are automatically copied to your clipboard for easy use.
- **User-Friendly Interface:** Lightweight and easy-to-use UI integrated into VS Code.

---

## Installation

1. Open VS Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac).
3. Search for `GitWit`.
4. Click **Install**.

Alternatively, download and install Gitwit from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MohammedAbidNafi.gitwit).

---

## Setup

After installing Gitwit, run the following commands to set up the extension:

1. **Select AI Model:** Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), type `GitWit: Select AI Model`, and press `Enter`.

2. **Enter API Key:** Open the Command Palette again, type `GitWit: Enter API Key`, and press `Enter`.

Supported models include:

- `gpt-4o`
- `gpt-4o-mini`
- `o1-preview`
- `o1-mini`
- `gpt-4-turbo`
- `gpt-4`
- `gpt-3.5-turbo`
- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-1.0-pro`

---

## Usage

1. **Make Changes:** Modify your code files as usual.
2. **Stage Changes:** Stage your changes using Git (`git add` or the Source Control panel in VS Code).
3. **Generate Commit Message:**
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Type `Gitwit: Generate Commit Message` and press `Enter`.
   - The generated commit message is automatically copied to your clipboard.
4. **Commit Changes:** Paste the message into your Git commit command or the VS Code Source Control panel and commit your changes.

---

## Requirements

- API KEY from either OpenAI or Gemini
- Active internet connection for AI-based functionality.
- Git installed on your system.

---

## License

Gitwit is open-source and available under the [GPL-3.0 License](https://www.gnu.org/licenses/gpl-3.0.html).

---

## Contributing

Contributions are welcome! If you encounter a bug, have a feature request, or want to contribute code:

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request.

---

## Support

If you have questions or need help, feel free to open an issue on the [GitHub repository](https://github.com/MohammedAbidNafi/GitWit).

---

## Acknowledgments

Thanks to OpenAI and Gemini for providing the AI models that power Gitwit and to the developers who contributed to this project. Let’s make committing easier and smarter!
