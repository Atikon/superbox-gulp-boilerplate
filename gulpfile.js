/* global require */

"use strict";

// Arguments

var argv = require("yargs").argv;

// Packages

var autoprefixer = require("autoprefixer");
var concat = require("gulp-concat");
var csso = require("postcss-csso");
var del = require("del");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var less = require("gulp-less");
var lesshint = require("gulp-lesshint");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var rename = require("gulp-rename");
var svg_sprite = require("gulp-svg-sprite");
var svgmin = require('gulp-svgmin');
var tap = require("gulp-tap");
var uglify = require("gulp-uglify");

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
        .pipe(plumber())
        .pipe(svgmin())
        .pipe(gulp.dest(paths.images.output))
        .pipe(notify({"message": "Successfully optimized SVGs"}));
});

// Create SVG sprite

gulp.task("create-svg-sprite", function() {
    del.sync(paths.images.output);

    return gulp.src(paths.images.input + "svg_sprite/*.svg")
        .pipe(plumber({
            "errorHandler": notify.onError({
                "title": "SVG Sprite Error",
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
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on("error", notify.onError({
                "title": "JavaScript Error",
                "message": "<%= error.message %>"
            })
        );
});

// Minify and concatenate JavaScripts

gulp.task("compile-js", ["lint-js"], function() {
    del.sync(paths.scripts.output);

    return gulp.src(paths.scripts.input + "*")
        .pipe(plumber())
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
                "title": "Less Error",
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
