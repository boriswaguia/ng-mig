ng-mig
======

Tool to help migrate your AngularJs to Angular

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ng-mig.svg)](https://npmjs.org/package/ng-mig)
[![CircleCI](https://circleci.com/gh/boriswaguia/ng-mig/tree/master.svg?style=shield)](https://circleci.com/gh/boriswaguia/ng-mig/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/ng-mig.svg)](https://npmjs.org/package/ng-mig)
[![License](https://img.shields.io/npm/l/ng-mig.svg)](https://github.com/boriswaguia/ng-mig/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ git clone https://github.com/boriswaguia/ng-mig.git && cd ng-mig
$ npm install
$ ./bin/run COMMAND
running command...
$ ng-mig (-v|--version|version)
ng-mig/0.0.0 darwin-x64 node-v10.15.3
$ ng-mig --help [COMMAND]
USAGE
  $ ng-mig COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [ng-mig](#ng-mig)
- [Usage](#usage)
- [Commands](#commands)
  - [`ng-mig hello [FILE]`](#ng-mig-hello-file)
  - [`ng-mig split`](#ng-mig-split)
  - [`ng-mig dependencies`](#ng-mig-dependencies)
  - [`ng-mig help [COMMAND]`](#ng-mig-help-command)

## `ng-mig hello [FILE]`

describe the command here

```
USAGE
  $ ng-mig hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ng-mig hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/boriswaguia/ng-mig/blob/master/src/commands/hello.ts)_

## `ng-mig split`

Search for all angularjs files, containing an angular.module declaration and extract functions to separated files.

```
USAGE
  $ ng-mig split

OPTIONS
  -h, --help       show CLI help
  -p, --project    specify the project root directory to use. If not specified, the current directory is used. We expect the given path to HAVE a src directory.

EXAMPLE
  $ ng-mig split --project ../project/angular-app
or
  $./bin/run split --project ../project/angular-app
```

_See code: [src/commands/split.ts](https://github.com/boriswaguia/ng-mig/blob/master/src/commands/split.ts)_


## `ng-mig dependencies`

Search for all angularjs files, containing an angular.module declaration and extract functions to separated files.

```
USAGE
  $ ng-mig dependencies

OPTIONS
  -h, --help       show CLI help
  -p, --project    specify the project root directory to use. If not specified, the current directory is used. We expect the given path to HAVE a src directory.

EXAMPLE
  $ ng-mig dependencies --project ../project/angular-app
or
  $./bin/run dependencies --project ../project/angular-app
```

_See code: [src/commands/dependencies.ts](https://github.com/boriswaguia/ng-mig/blob/master/src/commands/dependencies.ts)_


## `ng-mig help [COMMAND]`

display help for ng-mig

```
USAGE
  $ ng-mig help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
