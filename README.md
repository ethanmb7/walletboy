<div align="center">

  <img src="/assets/backpack.png" alt="Backpack Logo" />

  <h1>Backpack</h1>

  <p>
    <strong>A home for your xNFTs</strong>
  </p>

  <p>
    <a href="https://github.com/coral-xyz/backpack/actions"><img alt="Build Status" src="https://github.com/coral-xyz/backpack/actions/workflows/pull_requests_and_merges.yml/badge.svg" /></a>
    <a href="https://docs.xnfts.dev"><img alt="Tutorials" src="https://img.shields.io/badge/docs-tutorials-blueviolet" /></a>
    <a href="https://discord.gg/RhKxgS8SaD"><img alt="Discord Chat" src="https://img.shields.io/badge/chat-discord-blueviolet" /></a>
  </p>
</div>

## Important Note

- Backpack is in active development, so all APIs are subject to change.
- This code is unaudited. Use at your own risk.
- We emphasize: This is not ready for production use.

## Table of Contents

- [Important Note](#important-note)
- [Table of Contents](#table-of-contents)
- [Installing the Latest Release](#installing-the-latest-release)
- [Developing Locally](#developing-locally)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Build and Run](#build-and-run)
  - [Troubleshooting](#troubleshooting)
  - [Installing the Extension](#installing-the-extension)
- [License](#license)

## Installing the Latest Release

To install the latest development release:

1. Download the latest **build.zip** from our [Releases page](https://github.com/coral-xyz/backpack/releases).
2. In Chrome, go to `chrome://extensions/` and enable "Developer mode" (top right).
3. Drag and drop the downloaded zip file into the Chrome extensions page.

For a visual guide, please refer to [this video](https://user-images.githubusercontent.com/101902546/173857300-fc139113-0af5-46fc-baad-236a2ebf63f1.m4p).

## Developing Locally

### Prerequisites

- Git
- Node.js
- Yarn package manager
- Google Chrome browser

### Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:coral-xyz/backpack.git
   cd backpack
   ```

2. Enable self-signed local SSL certificates:
   - Navigate to `chrome://flags/#allow-insecure-localhost` in Chrome.
   - Enable the toggle and restart Chrome.
   > **Warning**: Only enable this for development. Disable it when you're done to avoid security vulnerabilities.

3. Set up environment variables:
   - Rename `.env.example` to `.env` and configure as needed.

4. Install dependencies:
   ```bash
   yarn install
   ```

### Build and Run

1. Build all packages:
   ```bash
   yarn build
   ```

2. Start the development server:
   ```bash
   yarn start
   ```

   > Note: For a fresh repository, always run `yarn build` before `yarn start`.

### Troubleshooting

If you encounter build issues:
```bash
yarn clean
yarn build
yarn start
```

For WebSocket connection errors (`wss://localhost:9997/ws failed`):

1. Install mkcert:
   ```bash
   cd packages/app-extension
   brew install mkcert
   ```

2. Generate and install certificates:
   ```bash
   mkcert localhost
   mkcert -install
   ```

Restart the development server after these steps.

### Installing the Extension

#### Development Version (with live-reloading)

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select the `packages/app-extension/dev` directory

If the `dev` folder is missing:
- Ensure all Node processes are terminated: `killall -9 node`
- Try running `yarn start` in both the root directory and `packages/app-extension`

#### Production Build

To test the production build:
1. Run `yarn build`
2. In `chrome://extensions/`, load the `packages/app-extension/build` directory

Note: This version won't have hot-reloading, and local plugins may not be visible unless you also run `yarn start`.

## License

By contributing to this project, you agree that your contributions will be licensed under the terms decided by the repository maintainers, unless explicitly stated otherwise.
