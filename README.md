# Tiky CLI
The scaffold of creating project of TypeScript and JavaScript library.

https://img.shields.io/npm/v/tiky
https://img.shields.io/npm/l/tiky

## Install

```bash
npm i tiky -g
```

## Usages
```
Usage: tiky [options] [project]

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

## Begin to configurate and create a new project 

begining.

```bash
tiky my_project
```

change your project name by typing;
```
* TIKY: Creating Project
* project: my_project
* dictionary: /Users/corro/projects/tiky
* date: 2020-4-22 20:24:16

? project name (my_project): 
```

change your project's version
```
? version 0.0.1
```

change your project author's name or email.
```
? author chenjk110
? email chenjk110@qq.com
```

select which language you want.
```
? type of source (Use arrow keys)
❯ JavaScript 
  TypeScript 
```

toggle tsconfig.json's flag by interactive checkbox.
```
? toggle flag in `tsconfig.json` (Press <space> to select, <a> to toggle all, <i> to invert selection)
 == Basic Options ==
❯◯ incremental
 ◯ allowJs
 ◯ checkJs
 ◯ declaration
 ◯ declarationMap
 ◯ sourceMap
 ◯ composite
 ◯ removeComments
 ◯ noEmit
```

select your project's build tool.
```
? select build tool (Use arrow keys)
❯ None 
  Webpack 
  TSC 
```

select your project's license.
```
? select license (Use arrow keys)
  MIT 
  MOZILLA 
  NO-LICENSE 
  UNLICENSE 
  WTFPL 
  AGPL 
  APACHE 
  ARTISTIC 
  BSD-3-CLAUSE 
  BSD 
```

select target ecma-version of dist.
```
? select target version of scripts (Use arrow keys)
❯ ES3 
  ES5 
  ES6 
  ESNext 
  ES2015 
  ES2016 
  ES2017 
```


select target module.
```
select target module (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ UMD
 ◯ AMD
 ◯ ES6
 ◯ CommonJS
 ◯ ES2015
 ◯ ES2020
 ◯ ESNext
```

create git repository and init commit.
```
init git repository (Y/n) 
```