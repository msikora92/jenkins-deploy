let gulp = require('gulp');
let config = require('./config');
let gulpif = require('gulp-if');
let pug = require('gulp-pug');
let less = require('gulp-less');
let minify = require('gulp-minifier');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let hash = require('gulp-hash-filename');

const CSS_ASSETS = config().cssAssets;
const JS_ASSETS = config().jsAssets;
const SRC_DIR = config().directories.src;
const DIST_DIR = config().directories.dist;
const MINIFIER_CONF = config().minifier;
const PUG_CONF = config().pug;
const HASH_CONF = config().hash;

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
        minify: args.minify || false,
        renameWithHash: false
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

    if (HASH_CONF.fileTypes.includes(compilerOpts.fileType)) {
        compilerOpts.renameWithHash = true;
        compilerOpts.hashedFileFormat = {
            format: HASH_CONF.format
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
        .pipe(gulpif(compilerOpts.renameWithHash, hash(compilerOpts.hashedFileFormat)))
        .pipe(gulp.dest(DIST_DIR + compilerOpts.destPath));
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

gulp.task('generate-html', () => {
    compileFiles({
        fileType: 'html',
        srcPath: '/*.pug',
        destPath: '/templates/components'
    });
});

gulp.task('default', ['copy-css', 'copy-js', 'generate-html']);
