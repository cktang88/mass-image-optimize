const sharp = require('sharp');
const fs = require('fs');

let basedir = require('./config.js').basedir;
console.log("Starting...");

// credit: https://gist.github.com/adamwdraper/4212319
let walk = (dir, done) => {
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }
    let i = 0;
    let next = () => {
      let filename = list[i++];
      if (!filename)
        return done(null);

      filepath = dir + '/' + filename;
      fs.stat(filepath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          // recurse down a directory
          walk(filepath, (err) => {
            next();
          });
        } else {
          // do stuff to file here
          processFile(filepath);
          next();
        }
      });
    }
    next();
  });
};

let processFile = (file) => {
  console.log(file);
  if (file.endsWith('.jpg')) {
    sharp(file)
      .resize(200)
      .toFile(file, (err, info) => {
        if (err)
          console.log(err);
      })
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
console.log('processing...');
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