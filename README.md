# eslint-plugin-no-use-in-server

Do not use client variables on the server

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-use-in-server`:

```sh
npm install eslint-plugin-no-use-in-server --save-dev
```

## Usage

Add `no-use-in-server` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-use-in-server"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-use-in-server/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


