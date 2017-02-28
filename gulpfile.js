var gulp = require('gulp');

var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

var useref = require('gulp-useref');

// Other requires...
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');

var del = require('del');

var runSequence = require('run-sequence');

gulp.task('sass', function(){
  return gulp.src('build/assets/scss/**/*.scss')
  .pipe(sass()) // Gets all files ending with .scss in app/scss and children dirs
  .pipe(gulp.dest('build/assets/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
});

gulp.task('useref', function(){
  return gulp.src('build/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
}); // run 'gulp useref'

gulp.task('images', function(){
  return gulp.src('build/assets/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      // Setting interlaced to true
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('build/assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
}); // run 'gulp fonts'

gulp.task('clean:dist', function(){
  return del.sync('dist');
}); // run 'gulp clean:dist'

gulp.task('build', ['sass', 'browserSync','useref']);