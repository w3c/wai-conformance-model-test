# WAI Conformance Model Test

This repository contains a site designed to demonstrate a wide variety of accessibility failures.

## Repository layout

The `site` folder contains the code used to build the site, powered by [Astro](https://astro.build/).

## Setting up a Development Environment

If you don't have one, we recommend installing an IDE that supports multiple languages (Javascript, HTML/CSS, etc).
[Visual Studio Code](https://code.visualstudio.com/) is recommended, as Astro provides an
[extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
which includes intellisense, syntax highlighting, and formatting of `.astro` files.

### Repository Setup with Node.js

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

### Broken and Fixed Versions

This repository includes components designed to allow implementing both "broken" and "fixed" versions side-by-side.
The above commands run the "broken" version by default.

To run the "fixed" version:

- `npm run dev:fixed` to run the dev server
- `npm run build:fixed` to run a build (previewable as before via `npm run preview`)

Note that the default "broken" version has been the initial focus of development,
so the "fixed" version is even more work-in-progress.
