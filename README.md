# Text Highlighter Chrome Extension

A powerful Chrome extension that lets you save, manage, and summarize text highlights from any webpage.

## ✨ Features

- **Text Highlighting**: Select and save important text from any webpage
- **Organized Storage**: All highlights are saved with source URL and timestamp
- **AI-Powered Summaries**: Generate concise summaries of your highlights using Groq's LLM API
- **Clean Interface**: Intuitive UI to manage and review your saved highlights
- **Cross-Page Persistence**: Access your highlights from any webpage

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup

1. Clone or fork the repository:

    ```sh
    # To clone
    git clone https://github.com/mian312/highlight-saver-extension.git
    cd highlight-saver-extension
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with your Groq API credentials:

    ```
    GROQ_API_KEY=your_api_key_here
    GROQ_MODEL=llama3-70b-8192
    GROQ_API_URL=https://api.groq.com/openai/v1
    ```

## 🏗️ Development

To start the development server:

```sh
npm run dev
```

This will start the Vite development server and open your default browser.

## 📦 Build 

To create a production build:

```sh
npm run build
```

This will generate the build files in the `build` directory.

## 📂 Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle switch in the top right corner
3. Click "Load unpacked" and select the `build` directory

Your Text Highlighter extension should now be loaded in Chrome!

## 🗂️ Project Structure

- `public/`: Contains static files and the `manifest.json`
- `src/`: Contains the React app source code
  - `App.tsx`: Main popup UI component
  - `background.ts`: Background script for extension functionality
  - `content.ts`: Content script that enables highlighting on webpages

## 📝 How to Use

1. Browse to any webpage
2. Select text you want to save
3. Click the "Save" button that appears
4. Open the extension popup to view your saved highlights
5. Click "Summarize" on any highlight to generate an AI summary

## License

This project is licensed under the MIT License.
