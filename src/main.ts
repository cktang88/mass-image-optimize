#!/usr/bin/env node

"use strict";
import * as sharp from "sharp";
import * as fs from "fs";
import * as sizeOf from "image-size";
import * as program from "commander";

// defaults
let max_width = 1200;
let max_height = 1200;
let basedir = process.cwd();

// TODO: parse command line options with commander...
program
  .option("-d, --dir <path>", "base directory containing unoptimized files")
  .option(
    "-w, --max_width <n>",
    "max width of new image (will also scale height, maintains aspect ratio",
    parseInt
  )
  .option(
    "-h, --max_height <n>",
    "max height of new image (will also scale width, maintains aspect ratio",
    parseInt
  )
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
let walk = (dir: string, done: any) => {
  // make new dir if doesn't exist
  let newdir = dir.replace(basedir, basedir + "-optimized");
  if (!fs.existsSync(newdir)) {
    fs.mkdirSync(newdir);
  }

  fs.readdir(dir, (err, list: string[]) => {
    if (err) {
      return done(err);
    }
    let i = 0;
    let next = () => {
      let filename = list[i++];
      if (!filename) return done(null);

      let filepath = dir + "/" + filename;
      fs.stat(filepath, (err, stat: fs.Stats) => {
        if (stat && stat.isDirectory()) {
          // recurse down a directory
          walk(filepath, err => {
            next();
          });
        } else {
          // process new file
          let newpath = newdir + "/" + filename;
          processFile(filepath, newpath);
          next();
        }
      });
    };
    next();
  });
};

let processFile = (file: string, newpath: string) => {
  console.log(file);
  // if image, optimize
  if (file.endsWith(".jpg") || file.endsWith(".png")) {
    const { width, height } = sizeOf(file);
    if (width < max_width && height < max_height) {
      return;
    }
    sharp(file)
      .resize(max_width, max_height)
      .max()
      .rotate()
      .toFile(newpath, (err, info) => {
        if (err) console.log(err);
      });
  }
  // else just copy
  else {
    fs.createReadStream(file).pipe(fs.createWriteStream(newpath));
  }
};

console.log("-------------------------------------------------------------");
console.log("Processing...");
console.log("-------------------------------------------------------------");

walk(basedir, err => {
  if (err) {
    throw err;
  } else {
    console.log(
      "-------------------------------------------------------------"
    );
    console.log("Finished.");
    console.log(
      "-------------------------------------------------------------"
    );
  }
});
