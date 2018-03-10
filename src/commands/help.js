import R from 'ramda';
import glob from 'glob';

const glob_options = {
  realpath: true,
  nodir: true
};

const command_files = R.flatten([
  glob.sync(`${__dirname}/*(!(index.js))`, glob_options),
  glob.sync(`${__dirname}/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*(!(help))/*.js`, glob_options)
]);

const help = R.mergeAll(R.map(path => {
  return require(path).help;
}, command_files));

export default {
  help: (msg, suffix) => {
    if (!suffix) {
      msg.reply("usage: ```!help <command>``` or ```!help all```");
    }
    else if (help[suffix]) {
      msg.reply(help[suffix]);
    }
  }
}
