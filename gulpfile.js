const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin');
    
gulp.task('serve', ['sass'], () => {

    browserSync.init({
        server: './app'
    });

    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/js/*.js').on('change', browserSync.reload);;
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('sass', () => 
    gulp.src('app/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
);

gulp.task('compress', (cb) => {
    pump([
        gulp.src('app/js/*.js'),
            uglify(),
            gulp.dest('dist/js')
        ],
        cb
    );
});

gulp.task('minify-html', ()=> 
    gulp.src('app/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'))
);

gulp.task('minify-css', () => 
    gulp.src('app/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
);

gulp.task('minify-img', () =>
    gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);


gulp.task('build', ['sass', 'compress', 'minify-html', 'minify-css', 'minify-img']);