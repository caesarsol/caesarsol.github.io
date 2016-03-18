import gulp from 'gulp'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import glob from 'glob'
import sass from 'gulp-sass'
import browserSyncModule from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import gutil from 'gulp-util'

let browserSync = browserSyncModule.create()

const config = {
  inFiles: {
    html: 'index.html',
    js:   'src/index.js',
    css:  'src/main.{sass,scss}',
  },
  outDir: './build/',
}

gutil.log('Starting!')

function logError(err) {
  gutil.log(
    `[${gutil.colors.blue(err.plugin)}] ${gutil.colors.red('Error:')}`,
    `${gutil.colors.red(err.messageFormatted || err.message)}`
  )
  // gutil.log(err)
}

gulp.task('js', function () {
  let browserify_opts = {
    paths: ['./node_modules', './src'],
    debug: true,
  }

  return browserify(filename, browserify_opts).transform(babelify).bundle()
    .on('error', logError)
    .pipe(source('index.js'))
    .pipe(gulp.dest(config.outDir))
    .pipe(browserSync.stream())
})

gulp.task('sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(sass()).on('error', logError)
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(config.outDir))
    .pipe(browserSync.stream())
})

gulp.task('html', function () {
  return gulp.src(config.inFiles.html) // Just watch
    .pipe(browserSync.stream())
})

//

gulp.task('build', ['js', 'sass', 'html'])

gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: '.'},
    ui: false,
    notify: false,
  })
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/**/*.{sass,scss}', ['sass'])
  gulp.watch('*.html', ['html'])
})

gulp.task('default', ['watch', 'server'])
