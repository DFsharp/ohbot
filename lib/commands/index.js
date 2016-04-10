import R from 'ramda';

export const command_files = [
    "./dota2",
    "./memes"
]; 



const commands = R.mergeAll(R.map(path => {
  return require(path).default;
}, command_files));

export default commands;