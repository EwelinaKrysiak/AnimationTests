const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');

sass.compiler = require('node-sass');

function showError(err) {
    console.log('----------------');
    console.log(err.messageFormatted);
    console.log('----------------');

    notifier.notify({
        title: 'Błąd SCSS',
        message: err.messageFormatted
    });
    this.emit("end");
}

const server = function(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false, //czy pokazywać tooltipa
        //host: "192.168.0.24", //IPv4 Address Wirless LAN adapter WiFi from ipconfig
        //port: 3000, //port na którym otworzy
        //browser: "google chrome" //jaka przeglądarka ma być otwierana - zaleznie od systemu - https://stackoverflow.com/questions/24686585/gulp-browser-sync-open-chrome-only
    });
    cb();
};

const css = function() {
    return gulp.src('./scss/main1.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle : "compressed" //compressed, expanded, nested, compact
        }).on('error', showError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
}
const watcher = function(cb) {
    gulp.watch('./scss/**/*.scss', gulp.series(css));
    gulp.watch("./*.html").on('change', browserSync.reload);
    cb();
}
exports.css = css;
exports.watcher = watcher;
exports.default = gulp.parallel(server, css, watcher);

