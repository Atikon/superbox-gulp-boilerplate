# Gulp Boilerplate

A Gulp boilerplate for creating new web projects with JavaScript, LESS and SVG sprites.

## Getting Started

### Dependencies

- [Node.js](http://nodejs.org)
- [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

### Quick Start

1. In terminal, `cd` into your project directory.
2. Run `npm install` to install required file.
3. Start watchtask with `gulp` or `gulp dev`.

## File Structure

```
.
|—— static/
|   |—— css/
|   |   |—— main.min.css
|   |—— img/
|   |   |—— # image files
|   |—— js/
|       |—— import/
|           |—— # JavaScript files
|   |   |—— main.js
|   |   |—— main.min.js
|   |—— less/
|       |—— import/
|           |—— # LESS files
|   |   |—— main.less
|   |—— svg/
|   |   |—— # SVG files
|   |   |—— sprite.svg
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
