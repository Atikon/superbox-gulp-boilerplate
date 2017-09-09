/* global require */

'use strict';

// Packages

var gulp = require('gulp'),
    gulp_concat = require('gulp-concat'),
    gulp_eslint = require('gulp-eslint'),
    gulp_less = require('gulp-less'),
    gulp_lesshint = require('gulp-lesshint'),
    gulp_plumber = require('gulp-plumber'),
    gulp_postcss = require('gulp-postcss'),
    gulp_rename = require('gulp-rename'),
    gulp_svg_sprite = require('gulp-svg-sprite'),
    gulp_svgo = require('gulp-svgo'),
    gulp_uglify = require('gulp-uglify'),
    postcss_autoprefixer = require('autoprefixer'),
    postcss_csso = require('postcss-csso');

// Paths

var paths = {
    css: 'static/css/',
    img: 'static/img/',
    js: 'static/js/',
    less: 'static/less/',
    svg: 'static/svg/',
};

// Check JavaScript syntax

gulp.task('lint-js', function() {
    return gulp.src([
            paths.js + '**/*.js',
            '!' + paths.js + 'main.min.js'
        ])
        .pipe(gulp_plumber())
        .pipe(gulp_eslint())
        .pipe(gulp_eslint.format())
        .pipe(gulp_plumber.stop());
});

// Compile a main.min.js

gulp.task('generate-js', ['lint-js'], function() {
    return gulp.src([
            paths.js + '**/*.js',
            '!' + paths.js + 'main.min.js'
        ])
        .pipe(gulp_plumber())
        .pipe(gulp_concat('main.min.js'))
        .pipe(gulp.dest(paths.js))
        .pipe(gulp_plumber.stop());
});

// Compile a uglified main.min.js

gulp.task('generate-uglified-js', ['lint-js'], function() {
    return gulp.src([
            paths.js + '**/*.js',
            '!' + paths.js + 'main.min.js'
        ])
        .pipe(gulp_plumber())
        .pipe(gulp_concat('main.min.js'))
        .pipe(gulp_uglify())
        .pipe(gulp.dest(paths.js))
        .pipe(gulp_plumber.stop());
});

// Check less syntax

gulp.task('lint-less', function() {
    return gulp.src(paths.less + '**/*.less')
        .pipe(gulp_plumber())
        .pipe(gulp_lesshint())
        .pipe(gulp_lesshint.reporter())
        .pipe(gulp_plumber.stop());
});

// Compile less files

gulp.task('compile-less', ['lint-less'], function() {
    return gulp.src(paths.less + '*.less')
        .pipe(gulp_plumber())
        .pipe(gulp_less({
            paths: [paths.less + 'import/**/'],
        }))
        .pipe(gulp_rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp_plumber.stop());
});

// Generates a css with PostCSS

gulp.task('generate-css', ['compile-less'], function() {
    return gulp.src(paths.css + '*.min.css')
        .pipe(gulp_plumber())
        .pipe(gulp_postcss([
            postcss_autoprefixer(),
        ]))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp_plumber.stop());
});

// Generates a minified css with PostCSS

gulp.task('generate-minified-css', ['compile-less'], function() {
    return gulp.src(paths.css + '*.min.css')
        .pipe(gulp_plumber())
        .pipe(gulp_postcss([
            postcss_autoprefixer(),
            postcss_csso(),
        ]))
        .pipe(gulp.dest(paths.css))
        .pipe(gulp_plumber.stop());
});

// Generates a svg sprite

gulp.task('generate-svg-sprite', function() {
    return gulp.src([
            paths.svg + '**/*.svg',
            '!' + paths.svg + 'sprite.svg'
        ])
        .pipe(gulp_plumber())
        .pipe(gulp_svg_sprite({
            'mode': {
                'symbol': {
                    'dest': '',
                    'sprite': 'sprite.svg',
                }
            }
        }))
        .pipe(gulp.dest(paths.svg))
        .pipe(gulp_plumber.stop());
});

// Generates a minified svg

gulp.task('generate-minified-svg', function() {
    return gulp.src(paths.img + '**/*.svg')
        .pipe(gulp_plumber())
        .pipe(gulp_svgo())
        .pipe(gulp.dest(paths.img))
        .pipe(gulp_plumber.stop());
});

// Watch tasks

gulp.task('dev', function() {
    gulp.watch(paths.img + '**/*.svg', ['generate-minified-svg']);
    gulp.watch(paths.js + '**/*.js', ['generate-js']);
    gulp.watch(paths.less + '**/*.less', ['generate-css']);
    gulp.watch(paths.svg + '**/*.svg', ['generate-svg-sprite']);
});

gulp.task('default', function() {
    gulp.watch(paths.img + '**/*.svg', ['generate-minified-svg']);
    gulp.watch([paths.js + 'import/**/*.js', paths.js + 'main.js'], ['generate-uglified-js']);
    gulp.watch(paths.less + '**/*.less', ['generate-minified-css']);
    gulp.watch(paths.svg + '**/*.svg', ['generate-svg-sprite']);
});
