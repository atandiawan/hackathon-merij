const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  })
})

gulp.task('sass', function() {
  return gulp.src('asset/sass/**/*.scss')
    .pipe(sass({style: 'compressed'}))
    .pipe(gulp.dest('asset/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('useref', function(){
  return gulp.src('*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('*.html', browserSync.reload)
  gulp.watch('asset/js/*.js', browserSync.reload)
  gulp.watch('asset/sass/**/*.scss', ['sass'])
})

gulp.task('images', function(){
  return gulp.src('asset/image/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('dist/image'))
})

gulp.task('fonts', function() {
  return gulp.src('asset/font/*')
  .pipe(gulp.dest('dist/font'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist')
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})
