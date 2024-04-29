const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()

function browsersync() {
    browserSync.init({
        server: {
            baseDir: './public/',
            serveStaticOptions: {
                extensions: ['html'],
            },
        },
        port: 8080,
        ui: { port: 8081 },
        open: true,
    })
}

function styles() {
    return src('./src/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./public/css/'))
        .pipe(browserSync.reload({ stream: true, }))
}

function scripts() {
    return src('./src/js/script.js')
        .pipe(dest('./public/js/'))
        .pipe(browserSync.stream())
}

function pages() {
    return src('./src/pages/*.html')
        .pipe(dest('./public/'))
        .pipe(browserSync.reload({ stream: true, }))
}

function copyFonts() {
    return src('./src/fonts/*.{eot,svg,ttf,woff,woff2}')
            .pipe(dest('./public/fonts/'));
}

function icons_build() {
    return src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(dest('./public/fonts/'));
}

function copyImages() {
    return src('./src/images/**/*')
        .pipe(dest('./public/images/'))
}

async function copyResources() {
    copyFonts()
    copyImages()
    icons_build()
}

function watch_dev() {
    watch(['./src/js/script.js'], scripts).on(
        'change',
        browserSync.reload
    )
    watch(['./src/pages/*.html'], pages).on(
        'change',
        browserSync.reload
    )
    watch(['./src/styles/*.scss'], styles).on(
        'change',
        browserSync.reload
    )
}

exports.browsersync = browsersync
exports.scripts = scripts
exports.styles = styles
exports.pages = pages
exports.copyResources = copyResources

exports.default = parallel(
    styles,
    scripts,
    copyResources,
    pages,
    browsersync,
    watch_dev
)

exports.build = series(
    styles,
    scripts,
    copyResources,
    pages
)
