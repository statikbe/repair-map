# repair-components

This package contains Vue components for Repair projects, styled with TailwindCSS.

## Getting started

Install the package to your Repair project:

```
@todo
```

## Local development

For local development, it is highly recommended to use `yalc` to link up this package to your Repair projects.

After cloning this repository, publish it to the `yalc` repository:

```
yalc publish
```

Then, in your Repair projects, link your local build like so:

```
yalc link repair-components
```

Now, if you make changes in your local components repository, you can quickly build and push the package to every local Repair project using `yarn build && yalc push` (or `yarn yalc` for short).

**Note:** After installing or removing Yarn packages in your Repair project, the components package has to be pushed again with `yalc push`.
