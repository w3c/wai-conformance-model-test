# **fix**able

`fixable`, provided by [Accessible Community](https://www.accessiblecommunity.org), is a site designed to show common accessibility errors and how to fix them.

## Repository layout

* The [`site`](https://github.com/accessiblecommunity/fixable/tree/main/site) folder contains the javascript code used to build the site.
    * `fixable` is powered by [Astro](https://astro.build/).

## Setting up a Development Environment

On almost every project, getting your development environment established is the first task and it can take a day or two to do so. This is a high-level overview so that you can be productive quickly.

If you don't have one, we recommend installing an IDE that supports multiple languages (Python, Javascript, HTML/CSS, etc). The recommendations are [VS Code](https://code.visualstudio.com/) or [Sublime Text](https://www.sublimetext.com/), but this is a developer choice.

The next step is to determine which development environment you would like to use. You can choose between a couple of options:

- A direct Node.js install.
- Running in a Docker container.

### Setting up a Development Environment using Node

**Note:** `npm` commands should be run **within the `site` directory**.

1. Install the [LTS version of Node](https://nodejs.org/en/download/prebuilt-installer/current) on your development machine.
   - If you need to manage multiple Node versions, you can use
     [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm)
1. Run `npm install` within the `site` directory to install the JS dependencies.
1. Run `npm start` within the `site` directory to run the development server.

Other useful npm commands within the `site` directory:

- `npm run check` to check for TypeScript errors
- `npm run build` to create a production build
- `npm run preview` to preview the production build created by `npm run build`

### Setting up a Development Environment using Docker

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) or another way to run a containerized environment.
  * If on Windows, we recommend installing the [Linux Subsystem](https://learn.microsoft.com/en-us/windows/wsl/install) to help performance, but it’s not required. See [configuring Docker Desktop to use WSL 2](https://docs.docker.com/desktop/wsl/).
2. There are a series a `make` commands to help you run the commands in Docker. To use those, you'll need to install a way to run `make`.
  * On Windows, use the Linux Subsystem or [chocolatey](https://chocolatey.org/).
  * On Mac, install the Xcode client tools or use [homebrew](https://brew.sh/).
  * If preferred, install some integration with the IDE you are using instead.
    * For instance, [`Makefile` support for VS Code](https://devblogs.microsoft.com/cppblog/now-announcing-makefile-support-in-visual-studio-code/)
3. Run `make serve` to launch the container, install the dependencies and run the development server.
