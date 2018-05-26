let gulp = require('gulp');
let gulpif = require('gulp-if');
let pug = require('gulp-pug');
let less = require('gulp-less');
let minify = require('gulp-minifier');
let concat = require('gulp-concat');
let rename = require('gulp-rename');

const CSS_ASSETS = [
    'node_modules/bootstrap/dist/css/bootstrap.css',
];

const JS_ASSETS = [
    'node_modules/angular/angular.js',
    'node_modules/angular-sanitize/angular-sanitize.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-touch/angular-touch.js',
    'node_modules/lodash/lodash.js'
];

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

const MINIFIER_CONF = {
    minify: true,
    minifyJS: true,
    minifyCSS: true,
    sourceMap: false
};

const PUG_CONF = {
    pretty: '\t',
    basedir: __dirname + '/' + SRC_DIR
};

// Check if file is inside "node_modules" folder
function isNodeModule(path) {
    path = path || false;

    if (path) {
        if (path.split('/')[0] == 'node_modules') {
            return true;
        } else {
            return false;
        }
    }

    return false;
}

// TODO: Add validations if a required key is missing
function setCompilerOpts(args) {
    let compilerOpts = {
        fileType: args.fileType || '',
        srcPath: args.srcPath || SRC_DIR,
        destFile: args.destFile || '.',
        destPath: args.destPath || DIST_DIR,
        concat: args.concat || false,
        minify: args.minify || false
    };

    // If there is more than one path to compile, add SRC_DIR to each path
    if (compilerOpts.srcPath instanceof Array) {
        compilerOpts.srcPath.forEach(function(element, index) {
            if (!isNodeModule(element)) {
                compilerOpts.srcPath[index] = SRC_DIR + element;
            }
        });
    } else {
        if (!isNodeModule(compilerOpts.srcPath)) {
            compilerOpts.srcPath = SRC_DIR + compilerOpts.srcPath;
        }
    }

    return compilerOpts;
}

function compileFiles(args) {
    let compilerOpts = setCompilerOpts(args);

    return gulp.src(compilerOpts.srcPath)
        .pipe(gulpif(compilerOpts.fileType === 'css', less()))
        .pipe(gulpif(compilerOpts.fileType === 'html', pug(PUG_CONF)))
        .pipe(gulpif(compilerOpts.concat, concat(compilerOpts.destFile)))
        .pipe(gulpif(compilerOpts.minify, minify(MINIFIER_CONF)))
        .pipe(gulp.dest(DIST_DIR + compilerOpts.destPath))
        .pipe(sync.stream());
}

gulp.task('copy-css', () => {
    compileFiles({
        fileType: 'css',
        srcPath: CSS_ASSETS,
        destPath: '/assets/css/common'
    });
});

gulp.task('copy-js', () => {
    compileFiles({
        fileType: 'js',
        srcPath: JS_ASSETS,
        destPath: '/assets/js/common'
    });
});

gulp.task('default', ['copy-css', 'copy-js']);
