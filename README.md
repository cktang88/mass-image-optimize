Mass-image-optimizer
---
Optimizes all images in a directory recursively, using Node.js and [sharp](https://github.com/lovell/sharp)

### Usage
---
create a `config.js` file in the main directory, with this format:
```
// base directory where to optimize
module.exports = {
  basedir: '[base directory path]',
  max_width: 800, // max image width in pixels after resizing
  max_height: 800 // max image height in pixels after resizing
}
```
Then run `npm start`

### Potential improvements/changes
---
* add support for console input for starting directory