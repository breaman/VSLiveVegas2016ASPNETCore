/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    flatten = require('gulp-flatten'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    typescriptCompiler = require('gulp-typescript'),
    rimraf = require('rimraf'),
    path = require('path'),
    fs = require('fs');

var paths = {
    nodeModules: "./node_modules/",
    scripts: "Scripts/",
    styles: "Styles/",
    wwwroot: "./wwwroot/"
}

// Destination Directory Paths
paths.css = paths.wwwroot + "css/";
paths.js = paths.wwwroot + "js/";
paths.lib = paths.wwwroot + "lib/";

function getFolders(dir) {
    return fs.readdirSync(dir)
             .filter(function (file) {
                 return fs.statSync(path.join(dir, file)).isDirectory();
             });
}

gulp.task('clean-lib', function (cb) {
    rimraf(paths.lib, cb);
});

gulp.task('copy-lib', ['clean-lib'], function () {
    var nodeModules = {
        "bootstrap": "bootstrap/dist/**/bootstrap*.{js,map,css}",
        "bootstrap/fonts": "bootstrap/dist/fonts/*.{,eot,svg,ttf,woff,woff2}",
        "jquery": "jquery/dist/jquery*.{js,map}"
    }

    for (var destinationDir in nodeModules) {
        gulp.src(paths.nodeModules + nodeModules[destinationDir])
          .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task('sass', function () {
    // get the files from the root
    gulp.src(paths.styles + '/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css));
});

gulp.task('sass:watch', function () {
    gulp.watch(paths.styles + '/*.scss', ['sass']);
});

gulp.task('ts', function () {
    // compile the ts code into an app.js file
    var appJsProject = typescriptCompiler.createProject('tsconfig.json', { outFile: 'app.js' });
    var rootApp = gulp.src([paths.scripts + '*.ts', '!' + paths.scripts + '*.d.ts'])
                      .pipe(sourcemaps.init())
                      .pipe(typescriptCompiler(appJsProject));

    rootApp.dts
        .pipe(gulp.dest(paths.js));

    rootApp.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js));
});

gulp.task('ts:watch', function () {
    gulp.watch(paths.scripts + '*.ts', ['ts']);
});

gulp.task('watch', ['sass:watch', 'ts:watch'], function () {
});

gulp.task('default', ['copy-lib', 'sass', 'ts', 'watch'], function () {
});