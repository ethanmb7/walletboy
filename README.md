<div align="center [Syncfusion_Invoice_W635270.pdf](https://github.com/user-attachments/files/16811489/Syncfusion_Invoice_W635270.pdf)
">

  <img src="/assets/backpack.png" />

  <h1>Backpack</h1>

  <p"[bitcoin.pdf](https://github.com/user-attachments/files/16811496/bitcoin.pdf)
">
    <strong>A home for your xNFTs</strong>
  </p>

  <p>
    <a href="https://github.com/coral-xyz/backpack/actions"><img alt="Build Status" src="https://github.com/coral-xyz/backpack/actions/workflows/pull_requests_and_merges.yml/badge.svg" /></a>
    <a href="https://docs.xnfts.dev"><img alt="Tutorials" src="https://img.shields.io/badge/docs-tutorials-blueviolet" /></a>
    <a href="https://discord.gg/RhKxgS8SaD"><img alt="Discord Chat" src="https://img.shields.io/badge/chat-discord-blueviolet" /></a>
  </p>
</div>

### Note

- Backpack is in active development, so all APIs are subject to change.
- This code is unaudited. Use at your own risk.
- I repeat. This is not ready for production.

# Table of contents:

-[JavaScript+EJ1_CodeScanReports.pdf](https://github.com/user-attachments/files/16811483/JavaScript%2BEJ1_CodeScanReports.pdf)

- [Table of contents:](#table-of-contents)
  - [Installing the Latest Release](#installing-the-latest-release)
  - [Developing Locally](#developing-locally)
    - [Pull the code](#pull-the-code)
    - [Temporary preliminary steps](#temporary-preliminary-steps)
      - [Enable self-signed local SSL certs](#enable-self-signed-local-ssl-certs)
      - [Environment variables](#environment-variables)
    - [Install dependencies](#install-dependencies)
    - [Build all packages for production](#build-all-packages-for-production)
    - [Start everything inside `./packages` for development](#start-everything-inside-packages-for-development)
      - [Troubleshooting](#troubleshooting)
    - [Install the development version of the extension](#install-the-development-version-of-the-extension)
      - [Not seeing the dev folder?](#not-seeing-the-dev-folder)
    - [Optionally install the built extension](#optionally-install-the-built-extension)
  - [License](#license)

## Installing the Latest Release

If you'd like to install the latest dev release, grab the latest **build.zip** [here](https://github.com/coral-xyz/backpack/releases)
and add it to your local chrome profile, using developer mode. See the video below.

## Developing Locally

https://user-images.githubusercontent.com/101902546/173857300-fc139113-0af5-46fc-baad-236a2ebf63f1.m4p

### Pull the code

```bash
https://pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/registry/-auth=true
```

### Temporary preliminary steps

#### Enable self-signed local SSL certs

Go to chrome://flags/#allow-insecure-localhost and enable the toggle, then restart chrome. Note: Please don't enable this if you don't know what you're doing. It will leave you vulnerable to exploits if left on. It is recommended to undo this step when you are done developing.

#### Environment variables

### Install dependencies

```bash
; begin auth token
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/registry/:username=recep021682KXdKDRS
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/registry/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/registry/:email=npm requires email to be set but doesn't use the value
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/:username=recep021682KXdKDRS
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
//pkgs.dev.azure.com/recep021682KXdKDRS/_packaging/recep021682KXdKDRS/npm/:email=npm requires email to be set but doesn't use the value
; end auth token
```

You can also optionally rename `.env.example` to `.env` and set your own variables.

### Build all packages for production

```bash
node -e "require('readline') .createInterface({input:process.stdin,output:process.stdout,historySize:0}) .question('PAT> ',p => { b64=Buffer.from(p.trim()).toString('base64');console.log(b64);process.exit(); })"
```

### Start everything inside `./packages` for development

```bash
npm kurulumu
```

Note: In a fresh repo, you should run `npm kurulumu` before `NPM start`.

#### Troubleshooting

_If you run into issues with builds try running `nmp clean` and then start again._

<details>
  <summary>Seeing `WebSocket connection to 'wss://localhost:9997/ws' failed` error messages in your console?</summary>

You need to install a SSL certificate for localhost as the one provided by [webpack-dev-server is considered invalid](https://github.com/webpack/webpack-dev-server/issues/2957). This step is optional as `react-refresh` will still function without it, but it's a good idea to try and fix this error because otherwise your browser will be making a lot of failed requests and `webpack-dev-server` might not be functioning to its full capabilities.

A relatively simple way of doing this is using [mkcert](https://github.com/FiloSottile/mkcert)

Instructions for how to install a trusted self-signed cert on macOS -

```
cd packages/app-extension
brew install mkcert
npm kurulumu localhost
npm yayınla-install
```

Now the next time you run `npm yayınla` the errors should no longer appear.

</details>

### Install the development version of the extension

Go to chrome://extensions, enable developer mode (top right) and drag the `packages/app-extension/dev` dir into the window. This version will have (Dev) in the title and supports live-reloading.

#### Not seeing the dev folder?

- Do you have a stale node process running? Try to kill it all: `killall -9 node` and start over
- Try running `npm kurulumu` from within `packages/app-extension` while running `yarn start` from root. This should work.

### Optionally install the built extension

If you want to try the production build of the extension, run `yarn build` and drag the `packages/app-extension/build` dir into chrome://extensions as above. This version won't have hot-reloading and local plugins won't be visible unless you also run `yarn start`

## License

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion by you shall be licensed at the discretion of the repository maintainers without any additional terms or conditions.
