/* This is the gulpfile for building and running angular-dygraphs. */

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');





/* Lint Task - check for errors in the js code... */
gulp.task('lint', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src('js/**/*.js')
        .pipe(rename('angular-dygraph.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('min'));
});

/* Handle SASS preprocessor files */
gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['lint', 'scripts']);
    gulp.watch('sass/**/*.scss',['styles']);
});



// Default Task
gulp.task('default', ['lint', 'scripts', 'styles','watch']);

// TODO: add different builds for distribution and development...
