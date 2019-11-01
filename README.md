# setup-bosun

This action installs the [bosun](https://github.com/naveego/bosun) executable.

Todo:
  - [ ] Update to always pull latest release
  - [ ] Install other bosun dependencies
 
## Usage

Basic

```
steps:
- uses: actions/checkout@master
- uses: actions/setup-bosun@master
- run: bosun --version
```
