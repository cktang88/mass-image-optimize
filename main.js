const sharp = require('sharp');
const fs = require('fs');

let walkPath = require('./config.js').basedir;
console.log("Starting...");

// credit: https://gist.github.com/adamwdraper/4212319
let walk = (dir, done) => {
  fs.readdir(dir, (error, list) => {
    if (error) {
      return done(error);
    }
    let i = 0;
    let next = () => {
      let file = list[i++];

      if (!file) {
        return done(null);
      }

      file = dir + '/' + file;

      fs.stat(file, (error, stat) => {

        if (stat && stat.isDirectory()) {
          // recurse down a directory
          walk(file, (error) => {
            next();
          });
        } else {
          // do stuff to file here
          console.log(file);

          next();
        }
      });
    }
    next();
  });
};

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

walk(walkPath, function (error) {
  if (error) {
    throw error;
  } else {
    console.log('-------------------------------------------------------------');
    console.log('finished.');
    console.log('-------------------------------------------------------------');
  }
});