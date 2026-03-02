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
- `npm run update-wcag` to update `wcag*.json` files under `src/lib`
  (this also runs `check` in case any updates impact currently-documented breaks)

### Broken and Fixed Variants

This repository includes components designed to allow implementing both "broken" and "fixed" variants side-by-side.
The above commands run the "broken" variant by default.

To produce the "fixed" output:

- `npm run dev:fixed` to run the dev server
- `npm run build:fixed` to run a build (previewable as before via `npm run preview`)

Note that the default "broken" version has been the initial focus of development,
so the "fixed" version is even more work-in-progress.

### Setting up a Development Environment using Docker

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) or another way to run a containerized environment.
  * If on Windows, we recommend installing the [Linux Subsystem](https://learn.microsoft.com/en-us/windows/wsl/install) to help performance, but it’s not required. See [configuring Docker Desktop to use WSL 2](https://docs.docker.com/desktop/wsl/).
2. There are a series a `make` commands to help you run the commands in Docker. To use those, you'll need to install a way to run `make`.
  * On Windows, use the Linux Subsystem or [chocolatey](https://chocolatey.org/).
  * On Mac, install the Xcode client tools or use [homebrew](https://brew.sh/).
  * If preferred, install some integration with the IDE you are using instead.
    * For instance, [`Makefile` support for VS Code](https://devblogs.microsoft.com/cppblog/now-announcing-makefile-support-in-visual-studio-code/)
3. Run `make serve` to launch the container, install the dependencies and run the development server.

## Authoring Breaks

A couple of components exist to help with implementing broken and fixed variants of features side-by-side.
These work with the commands listed above to produce the broken and fixed variants.

### Defining Different Attributes on One Element with Fixable

```astro
<Fixable as="tagname" ... broken={...} fixed={...}>
<Fixable as={Component} ... broken={...} fixed={...}>
```

- `as`: specifies the tag (string) or component (constructor) to render
- Top-level attributes are common between both broken and fixed variants
- Any attributes specific to either the broken or fixed variant should be
  defined within `broken` or `fixed` (each of these is optional)

### Defining a Different Set of Elements with FixableRegion

```astro
<FixableRegion>
  (broken rendering)
  <... slot="fixed">
    (fixed rendering)
  </...>
</FixableRegion>
```

- Top-level elements are rendered for the broken variant
- The element with `slot="fixed"` is rendered for the fixed variant
  - Multiple top-level elements can be rendered for the fixed variant by
    nesting them under `<Fragment slot="fixed">`

## Documenting Breaks

Breaks can be documented alongside their implementation.

In Astro files (for pages or components):

```ts
/**
 * @break
 * location: Home & Search
 * process: learning
 * href: /#main
 * wcag2: 2.2.2
 * wcag3: Motion
 * description: ...
 * discussionItems:
 *   - ...
 */
```

In Markdown frontmatter (for collection entries):

```yaml
breaks:
  - location: Home & Search
    process: learning
    href: /#main
    wcag2: 2.2.2
    wcag3: Motion
    description: ...
    discussionItems:
      - ...
```

In both cases, the same YAML format is used.

### Properties

- **location** - Indicates what part of the site contains the break;
  must reference an existing `id` in `src/content/sections.json`
- **process** - Indicates which process (i.e. user flow) contains the break;
  must reference one or more existing `id`s in `src/content/processes.json`
  - May be `ALL`, to indicate a break that impacts all processes
- **href** - Indicates URL where the break can be observed; see further remarks below
- **wcag2** - WCAG 2 Success Criterion number(s)
- **wcag3** - WCAG 3 Requirement(s)
- **description** - Description(s) of break(s)
- **discussionItems** - Optional list of discussion items

`wcag2`, `wcag3`, and `description` may be lists or a single value.
Either `wcag2` or `wcag3` (or both) must be specified.

See `src/content.config.ts` for the full zod schema specification for
both breaks and sections.

### Specifying Default Values for an Entire File

If a file documents many breaks that pertain to the same `location`, `process`, or `href`,
it may be specified once across the entire file instead via
`breaklocation`, `breakprocess`, or `breakhref`, respectively.
The value can then be omitted from individual break definitions.
If an individual definition still defines the respective property,
it will override the file-wide setting.

In Astro files:

```ts
/** @breakprocess learning */
```

In Markdown frontmatter:

```yaml
breakprocess: learning
```

### The `href` Property

The path part of `href`'s value should always begin and end with `/` for consistency,
and is treated as relative to the Museum homepage (`/museum/`).
A hash part may optionally be included after the trailing slash.

#### Default Behavior

The `href` property is required, but defaults are provided in the following cases:

- Files under `src/pages` which correspond to a single output file (i.e. no `[...]`)
- Files under `src/content`

In these cases, the `href` property will default to pointing to
the `main` element (i.e. `#main`) at the page or entry's corresponding URL.
This can be overridden, both by file-wide `breakhref` and within specific breaks.

#### Hash-only Overrides

In cases where a default page is defined (either via the above cases,
or file-wide via `breakhref`), it is possible to override a specific break to
point to a different region of the same page by specifying only a hash.
Note, however, that this needs to be quoted, to avoid YAML interpreting it as a comment:

```yaml
href: "#my-other-section"
```

In these cases, it is also possible to point specifically to the top of the
default page (i.e. with no hash in the URL) by specifying an empty string:

```yaml
href: ""
```
