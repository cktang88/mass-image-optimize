Mass-image-optimizer
---
Optimizes all images in a directory recursively, using Node.js and [sharp](https://github.com/lovell/sharp)

### Dev
---
```bash
$ git clone https://github.com/cktang88/mass-image-optimize`
$ cd mass-image-optimize
$ npm i
$ npm run dev
$ npm link  //create symlink so that you can use shell command to try it out.
```

### Usage
---
First install globally:
```
npm i -g mass-image-optimize
```
Then execute with:
```
mio --dir=<name of dir>
```

Additional options:
```
--max_width=<max width in pixels>
--max_height=<max height in pixels>
```
