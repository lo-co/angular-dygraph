/* This is the gulpfile for building and running angular-dygraphs. */

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
//var sass = require('gulp-sass');
var connect = require('gulp-connect');
var open = require('gulp-open');
var ngdocs = require('gulp-ngdocs');

// Force the order of files to be correct...
var jsList = ["js/cirrus-dygraphs-dev.js", 'js/angular-dygraph.js'];

/* Lint Task - check for errors in the js code... */
gulp.task('lint', function () {
    return gulp.src(jsList)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(jsList)
        .pipe(concat('cirrus-dygraphs.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('cirrus-dygraph.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

/* Handle SASS preprocessor files */
gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['lint', 'scripts', 'ngdocs']);
    //gulp.watch('sass/**/*.scss',['styles']);
});

// generate documentation
gulp.task('ngdocs', function () {

    var options = {
        html5Mode: false,
        title: 'Angular-Dygraphs'
    }
    return gulp.src('js/**/*.js')
        .pipe(ngdocs.process(options))
        .pipe(gulp.dest('./docs'));

});

/* Make a connection on port 8000 for the ngdocs server. */
gulp.task('connect2docs', function () {
    connect.server({
        root: 'docs',
        livereload: true,
        port: 8010
    });
    console.log('Server started on http://localhost:8000');
});


/* This will open the UI in the default browser. */
gulp.task('open', function () {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:8000'
        }));
});




// Default Task
gulp.task('default', ['lint', 'scripts', 'ngdocs', 'connect2docs', 'open', 'watch']);

// TODO: add different builds for distribution and development...
