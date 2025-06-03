const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
  html: './*.html',
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  js: {
    src: 'src/js/**/*.js'
  }
};

// Compile SCSS
function styles() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream()); // Inject CSS
}

// Serve + Watch
function serve() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(paths.scss.src, styles);                    // SCSS changes
  gulp.watch(paths.html).on('change', browserSync.reload); // HTML changes
  gulp.watch(paths.js.src).on('change', browserSync.reload); // JS changes
}

// Default task
exports.default = gulp.series(styles, serve);
