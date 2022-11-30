# eslint-plugin-no-globals-in-server

Do not use client variables on the server

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-globals-in-server`:

```sh
npm install eslint-plugin-no-globals-in-server --save-dev
```

## Usage

Add `no-globals-in-server` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["no-globals-in-server"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "no-globals-in-server/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
