'use strict';
//Main files
const gulp = require('gulp');
const rename = require('gulp-rename');

//Minified the code
const uglify = require('gulp-uglify');

//Convert sass to css
const sass = require('gulp-sass');

//Transpiler
const babel = require('gulp-babel');

//Modules handler
const webpack = require('gulp-webpack');
const webpackStream = require('webpack-stream');

//Sass to Css ->
gulp.task('sass', function(){
	return gulp.src('sass/styles.scss')
    	.pipe(sass()) // Converts Sass to CSS with gulp-sass
    	.pipe(gulp.dest('css'));
});

//Modules Es6 to regular minified Es5 file ->
gulp.task('optimise', function() {
  return gulp.src('app/main.js')
    .pipe(webpackStream(), webpack)
    .pipe(babel())
    //.pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('react', function() {
  return gulp.src('app/librairies/react.js')
    .pipe(webpackStream(), webpack)
    .pipe(uglify())
    .pipe(rename('react.min.js'))
    .pipe(gulp.dest('dist'));
});

//Observers
gulp.task('watch-sass', function() {
  gulp.watch('app/scss/styles.scss', ['sass']);
  gulp.watch('app/scss/*/*.scss', ['sass']);
});

gulp.task('watch-js', function() {
  gulp.watch('app/*.js', ['optimise']);
  gulp.watch('app/*/*.js', ['optimise']);
});

gulp.task('watch-all', function() {
  gulp.watch('app/*.js', ['optimise']);
  gulp.watch('app/*/*.js', ['optimise']);
  gulp.watch('app/scss/styles.scss', ['sass']);
  gulp.watch('app/scss/*/*.scss', ['sass']);
});