#!/usr/bin/env node
'use strict';
var sharp = require('sharp');
var fs = require('fs');
var sizeOf = require('image-size');
var program = require('commander');
var path = require('path');
// defaults
var max_width = 1200;
var max_height = 1200;
var basedir = process.cwd();
// TODO: parse command line options with commander...
program
    .option('-d, --dir <path>', 'base directory containing unoptimized files')
    .option('-w, --max_width <n>', 'max width of new image (will also scale height, maintains aspect ratio', parseInt)
    .option('-h, --max_height <n>', 'max height of new image (will also scale width, maintains aspect ratio', parseInt)
    .parse(process.argv);
// if program was called with no arguments, show help. (or use defaults?)
console.log(program.dir);
if (!program.dir || program.dir.length === 0) {
    // first arg is node.js, second arg is main.js
    program.help();
    process.exit();
}
// TODO: convert dir argument to relative dir, relative to current dir?
process.exit();
// credit: https://gist.github.com/adamwdraper/4212319
var walk = function (dir, done) {
    // make new dir if doesn't exist
    var newdir = dir.replace(basedir, basedir + '-optimized');
    if (!fs.existsSync(newdir)) {
        fs.mkdirSync(newdir);
    }
    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }
        var i = 0;
        var next = function () {
            var filename = list[i++];
            if (!filename)
                return done(null);
            var filepath = dir + '/' + filename;
            fs.stat(filepath, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    // recurse down a directory
                    walk(filepath, function (err) {
                        next();
                    });
                }
                else {
                    // process new file
                    var newpath = newdir + '/' + filename;
                    processFile(filepath, newpath);
                    next();
                }
            });
        };
        next();
    });
};
var processFile = function (file, newpath) {
    console.log(file);
    // if image, optimize
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
        var _a = sizeOf(file), width = _a.width, height = _a.height;
        if (width < max_width && height < max_height) {
            return;
        }
        sharp(file)
            .resize(max_width, max_height)
            .max()
            .rotate()
            .toFile(newpath, function (err, info) {
            if (err)
                console.log(err);
        });
    }
    // else just copy
    else {
        fs.createReadStream(file, function (err) {
            console.log(err);
        }).pipe(fs.createWriteStream(newpath, function (err) {
            console.log(err);
        }));
    }
};
console.log('-------------------------------------------------------------');
console.log('Processing...');
console.log('-------------------------------------------------------------');
walk(basedir, function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log('-------------------------------------------------------------');
        console.log('Finished.');
        console.log('-------------------------------------------------------------');
    }
});
