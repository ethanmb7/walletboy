<div align="center">

  <img src="/assets/backpack.png" />

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

### Note

- Backpack is in active development, so all APIs are subject to change.
- This code is unaudited. Use at your own risk.
- I repeat. This is not ready for production.

add watching mode for bundler
Merge pull request #117 from myron-li/action
Merge pull request #109 from luffy-wang/enhance-request
chore: 🤖 update service assets
Merge branch 'master' of https://git.toolsfdg.net/fe/mini-program into enhance-request
Merge pull request #115 from chengfan-lin/api-taro
Merge branch 'master' into feature/custom-event
Merge pull request #114 from bowen-zhu/feature/bundler
Merge branch 'master' of https://git.toolsfdg.net/fe/mini-program into enhance-request
Merge pull request #113 from myron-li/MYRON-1
chore: fix typo
Merge pull request #111 from chengfan-lin/api-taro
Merge pull request #112 from james-l/simplify-taro-plugin
make bxss generate correct sourcemap when is in development
simplify taro plugin and make it work as an npm package
Merge pull request #108 from luffy-wang/add-icon
Merge pull request #107 from james-l/fix/yarn-command-of-build-taro-plugin
Merge pull request #106 from myron-li/batch-updated
optimize: batch setData call
Merge pull request #105 from michael-xu/feature/components
Merge pull request #104 from myron-li/optimize
chore: optimize build
Merge pull request #103 from bowen-zhu/fix/bunlder
Merge pull request #102 from james-l/fix/sourcemap-of-css
dont let bxss generate sourcemap
Merge pull request #101 from james-l/change-output-of-taro-plugin
Merge branch 'master' into change-output-of-taro-plugin
added components definitions of uikit requirements
test: 💍 add test cases
use tsc instead of rollup as the packer
Merge pull request #95 from myron-li/refactor
add sourcemap to bjs files
use a modified app loader instead of origin one
let page's code export via umd
make output of the page scripts ends with .bjs
Merge pull request #87 from bowen-zhu/feature/app-bundler
chore: 🤖 remove bundled files
chore: 🤖 add todos
chore: 🤖 rename .tpl -> .bxml
chore: 🤖 update package.json
test: 💍 update test cases
test: 💍 update test cases
Merge pull request #90 from james-l/Feature/taro-integration
add components
Merge pull request #91 from myron-li/custom-event
chore: custom component
add code to support lifecycle callback of taro for Page object
added REDME to taro plugin package
# Table of contents:

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
git clone git@github.com:coral-xyz/backpack.git
cd backpack
```

### Temporary preliminary steps

#### Enable self-signed local SSL certs

Go to chrome://flags/#allow-insecure-localhost and enable the toggle, then restart chrome. Note: Please don't enable this if you don't know what you're doing. It will leave you vulnerable to exploits if left on. It is recommended to undo this step when you are done developing.

#### Environment variables

### Install dependencies

```bash
yarn install
```

You can also optionally rename `.env.example` to `.env` and set your own variables.

### Build all packages for production

```bash
yarn build
```

### Start everything inside `./packages` for development

```bash
yarn start
```

Note: In a fresh repo, you should run `yarn build` before `yarn start`.

#### Troubleshooting

_If you run into issues with builds try running `yarn clean` and then start again._

<details>
  <summary>Seeing `WebSocket connection to 'wss://localhost:9997/ws' failed` error messages in your console?</summary>

You need to install a SSL certificate for localhost as the one provided by [webpack-dev-server is considered invalid](https://github.com/webpack/webpack-dev-server/issues/2957). This step is optional as `react-refresh` will still function without it, but it's a good idea to try and fix this error because otherwise your browser will be making a lot of failed requests and `webpack-dev-server` might not be functioning to its full capabilities.

A relatively simple way of doing this is using [mkcert](https://github.com/FiloSottile/mkcert)

Instructions for how to install a trusted self-signed cert on macOS -

```
cd packages/app-extension
brew install mkcert
mkcert localhost
mkcert -install
```

Now the next time you run `yarn start` the errors should no longer appear.

</details>

### Install the development version of the extension

Go to chrome://extensions, enable developer mode (top right) and drag the `packages/app-extension/dev` dir into the window. This version will have (Dev) in the title and supports live-reloading.

#### Not seeing the dev folder?

- Do you have a stale node process running? Try to kill it all: `killall -9 node` and start over
- Try running `yarn start` from within `packages/app-extension` while running `yarn start` from root. This should work.

### Optionally install the built extension

If you want to try the production build of the extension, run `yarn build` and drag the `packages/app-extension/build` dir into chrome://extensions as above. This version won't have hot-reloading and local plugins won't be visible unless you also run `yarn start`

## License

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion by you shall be licensed at the discretion of the repository maintainers without any additional terms or conditions.
