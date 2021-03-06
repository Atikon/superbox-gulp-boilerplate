/* global require */

"use strict";

// Arguments

var argv = require("yargs").argv;

// Packages

var autoprefixer = require("autoprefixer"),
    concat = require("gulp-concat"),
    csso = require("postcss-csso"),
    del = require("del"),
    eslint = require("gulp-eslint"),
    gulp = require("gulp"),
    gulpif = require("gulp-if"),
    less = require("gulp-less"),
    lesshint = require("gulp-lesshint"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    svg_sprite = require("gulp-svg-sprite"),
    svgo = require("gulp-svgo"),
    tap = require("gulp-tap"),
    uglify = require("gulp-uglify");

// Paths

var paths = {
    "images": {
        "input": "src/images/",
        "output": "dist/images/",
    },
    "scripts": {
        "input": "src/scripts/",
        "output": "dist/scripts/"
    },
    "styles": {
        "input": "src/styles/",
        "output": "dist/styles/"
    }
};

// Optimize SVG

gulp.task("optimize-svg", function() {
    del.sync([
        paths.images.output + "**/*.svg",
        "!" + paths.images.output + "sprite.symbol.svg"
    ])

    return gulp.src([
            paths.images.input + "**/*.svg",
            "!" + paths.images.input + "svg_sprite/*.svg"
        ])
        .pipe(plumber({
            "errorHandler": notify.onError({
                "title": "Optimizing SVGs failed",
                "message": "<%= error.message %>"
            })
        }))
        .pipe(svgo())
        .pipe(gulp.dest(paths.images.output))
        .pipe(notify({"message": "Successfully optimized SVGs"}));
});

// Create SVG sprite

gulp.task("create-svg-sprite", function() {
    del.sync(paths.images.output);

    return gulp.src(paths.images.input + "svg_sprite/*.svg")
        .pipe(plumber({
            "errorHandler": notify.onError({
                "title": "Creating SVG sprite failed",
                "message": "<%= error.message %>"
            })
        }))
        .pipe(svg_sprite({
            "mode": {
                "symbol": {
                    "dest": "",
                    "sprite": "sprite.symbol.svg"
                }
            }
        }))
        .pipe(gulp.dest(paths.images.output))
        .pipe(notify({"message": "Successfully created SVG sprite"}));
});

// Lint JavaScript

gulp.task("lint-js", function() {
    return gulp.src(paths.scripts.input + "**/*.js")
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
});

// Minify and concatenate JavaScripts

gulp.task("compile-js", ["lint-js"], function() {
    del.sync(paths.scripts.output);

    return gulp.src(paths.scripts.input + "*")
        .pipe(plumber({
            "errorHandler": notify.onError({
                "title": "Compiling JavaScript failed",
                "message": "<%= error.message %>"
            })
        }))
        .pipe(tap(function(file) {
            if (file.isDirectory()) {
                return gulp.src(file.path + "/*.js")
                    .pipe(concat(file.relative + ".js"))
                    .pipe(rename({ "suffix": ".min" }))
                    .pipe(gulpif(argv.production, uglify()))
                    .pipe(gulp.dest(paths.scripts.output));
            }

            return gulp.src(file.path)
                .pipe(rename({ "suffix": ".min" }))
                .pipe(gulpif(argv.production, uglify()))
                .pipe(gulp.dest(paths.scripts.output));
        }))
        .pipe(notify({
            "message": "Successfully compiled JavaScript",
            "onLast": true
        }));
});

// Lint Less

gulp.task("lint-less", function() {
    return gulp.src(paths.styles.input + "**/*.less")
        .pipe(plumber())
        .pipe(lesshint())
        .pipe(lesshint.reporter());
});

// Compile Less files

gulp.task("compile-less", ["lint-less"], function() {
    del.sync(paths.styles.output);

    var processors = [
        autoprefixer
    ];

    if (argv.production) {
        processors.push(csso)
    }

    return gulp.src(paths.styles.input + "*.less")
        .pipe(plumber({
            "errorHandler": notify.onError({
                "title": "Compiling Less failed",
                "message": "<%= error.message %>"
            })
        }))
        .pipe(less({"paths": [ paths.styles.input + "import/**/" ]}))
        .pipe(rename({ "suffix": ".min" }))
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(notify({"message": "Successfully compiled Less"}));
});

// Tasks

gulp.task("compile", [
    "create-svg-sprite",
    "compile-js",
    "compile-less"
]);

gulp.task("default", [
    "compile"
]);

gulp.task("watch", function() {
    gulp.watch([
        paths.images.input + "**/*.svg",
        "!" + paths.images.input + "svg_sprite/*.svg"
    ], ["optimize-svg"]);
    gulp.watch(paths.images.input + "svg_sprite/*.svg", ["create-svg-sprite"]);
    gulp.watch(paths.styles.input + "**/*.less", ["compile-less"]);
    gulp.watch(paths.scripts.input + "/*", ["compile-js"]);
});
