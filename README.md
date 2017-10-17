Mass-image-optimizer
---
Optimizes all images in a directory recursively, using Node.js and [sharp](https://github.com/lovell/sharp)

### Usage
---
create a `config.js` file in the main directory, with this format:
```
// base directory where to optimize
exports.basedir = 'C:/Users/Apache/Pictures/2015-07';
```
Then run `npm start`