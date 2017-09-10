# Gulp Boilerplate

A Gulp boilerplate for creating new web projects with JavaScript, LESS and SVG sprites.

## Features

- Lints, concatenates, and optimizes JavaScript files
- Compiles LESS files and automatically adds vendor prefixes
- Optimizes SVGs
- Generates SVG sprites

## Getting Started

### Dependencies

- [Node.js](http://nodejs.org)
- [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In terminal, `cd` into your project directory.
2. Run `npm install` to install required files.
3. Start watch task with `gulp watch`.

### Settings

Comming soon - Work in Progress

### Tasks

* watch: Watches all declared source files for changes and triggers compilation
* compile: Compiles sources

### Development and production

Default is development mode. Run `gulp --production` it will minify your JavaScript and CSS.

## Features

* Gulp.js [Less](https://www.npmjs.org/package/gulp-less)

## File Structure

Comming soon - Work in Progress

```
gulp-boilerplate
|—— dist/
|   |—— images/
|   |   |—— sprite.symbol.svg
|   |   |—— # optimized image files
|   |—— scripts/
|   |   |—— example.min.js
|   |   |—— main.min.js
|   |—— styles/
|   |   |—— main.min.css
|—— src/
|   |—— images/
|   |   |—— svg_sprite
|   |   |   |—— # svg files
|   |   |—— # image files
|   |—— scripts/
|   |   |—— main
|   |   |   |—— example.js
|   |   |—— example.js
|   |—— styles/
|   |   |—— import/
|   |   |   |—— # LESS imports
|   |   |—— main.less
|—— .browserslistrc
|—— .eslintrc.json
|—— .lesshintrc
|—— gulfile.js
|—— package.json
|—— README.md
```

## License

The code is available under the [MIT License](LICENSE.md).

## Todo

* Add Gulp plugin for image optimization (gif, png, jpg)
* Write unit tests
