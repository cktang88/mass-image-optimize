#!/usr/bin/env node

'use strict'
const sharp = require('sharp');
const fs = require('fs');
const sizeOf = require('image-size');
const program = require('commander');

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();

// defaults
let max_width = 1200;
let max_height = 1200;
let basedir = path.basename(process.cwd());



// credit: https://gist.github.com/adamwdraper/4212319
let walk = (dir, done) => {
  // make new dir if doesn't exist
  let newdir = dir.replace(basedir, basedir + '-optimized');
  if (!fs.existsSync(newdir)) {
    fs.mkdirSync(newdir);
  }

  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }
    let i = 0;
    let next = () => {
      let filename = list[i++];
      if (!filename)
        return done(null);

      let filepath = dir + '/' + filename;
      fs.stat(filepath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          // recurse down a directory
          walk(filepath, (err) => {
            next();
          });
        } else {
          // process new file
          let newpath = newdir + '/' + filename;
          processFile(filepath, newpath);
          next();
        }
      });
    }
    next();
  });
};

let processFile = (file, newpath) => {
  console.log(file);
  // if image, optimize
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    const {
      width,
      height
    } = sizeOf(file);
    if (width < max_width && height < max_height) {
      return;
    }
    sharp(file)
      .resize(max_width, max_height)
      .max()
      .rotate()
      .toFile(newpath, (err, info) => {
        if (err)
          console.log(err);
      })
  }
  // else just copy
  else {
    fs.createReadStream(file, (err) => {
      console.log(err);
    }).pipe(fs.createWriteStream(newpath, (err) => {
      console.log(err);
    }));
  }
}

// optional command line params
// source for walk path
process.argv.forEach((val, index, array) => {
  if (val.indexOf('source') !== -1) {
    walkPath = val.split('=')[1];
  }
});

console.log('-------------------------------------------------------------');
console.log('Processing...');
console.log('-------------------------------------------------------------');

walk(basedir, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('-------------------------------------------------------------');
    console.log('Finished.');
    console.log('-------------------------------------------------------------');
  }
});