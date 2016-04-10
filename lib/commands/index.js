import R from 'ramda';
import glob from 'glob';

const glob_options = {
  realpath: true,
  nodir: true
};

export const command_files = R.flatten([
  glob.sync(`${__dirname}/*(!(index.js))`, glob_options),
  glob.sync(`${__dirname}/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*(!(help))/*.js`, glob_options)
]);

//export const command_files = [
//    "./dota2",
//    "./memes",
//    "./utils"
//]; 



const commands = R.mergeAll(R.map(path => {
  return require(path).default;
}, command_files));

export default commands;