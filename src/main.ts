"use strict";
import * as sharp from "sharp";
// use fs-extra instead of fs, so that all calls are promisified
import * as fse from "fs-extra";
import * as sizeOf from "image-size";
import * as program from "commander";

program
  .option(
    "-d, --dir <path>",
    "base absolute directory containing unoptimized files"
  )
  .option(
    "-w, --max_width <n>",
    "max width of new image (maintains aspect ratio)",
    parseInt
  )
  .option(
    "-h, --max_height <n>",
    "max height of new image (maintains aspect ratio)",
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
// defaults
let max_width = program.max_width || 1200;
let max_height = program.max_height || 1200;
let basedir = program.dir || process.cwd();

console.log("PROCESSING...");
// track # of images processed
let numimages = 0;
try {
  walk(basedir);
} catch (e) {
  console.error(e);
}

async function walk(dir: string) {
  // make new dir if doesn't exist
  let newdir = dir.replace(dir, dir + "-optimized");
  if (!fse.existsSync(newdir)) {
    console.log("New directory: ", newdir);
    try {
      await fse.mkdir(newdir);
    } catch (err) {
      console.error(err);
    }
  }
  const list: string[] = await fse.readdir(dir);
  // depth first traversal
  const promises = list.map(async function(filename) {
    if (!filename) return null;
    let filepath = dir + "/" + filename;
    const stat: fse.Stats = await fse.stat(filepath);
    if (stat && stat.isDirectory()) {
      // recurse down a directory
      await walk(filepath);
    } else {
      // process new file
      const newpath = newdir + "/" + filename;
      await processFile(filepath, newpath);
    }
  });
  await Promise.all(promises);
  console.log("DONE.", numimages, "images processed.");
}

async function processFile(file: string, newpath: string) {
  // console.log(file);
  // if image, optimize
  if (file.endsWith(".jpg") || file.endsWith(".png")) {
    numimages += 1;
    const { width, height } = sizeOf(file);
    // if too small, just copy
    if (width < max_width && height < max_height) {
      try {
        await fse.copy(file, newpath);
      } catch (err) {
        console.error(err);
      }
    }
    await sharp(file)
      .resize(max_width, max_height)
      .max()
      .rotate()
      .toFile(newpath, (err, info) => {
        if (err) console.log(err);
      });
  }
  // else just copy
  else {
    try {
      await fse.copy(file, newpath);
    } catch (err) {
      console.error(err);
    }
  }
}
