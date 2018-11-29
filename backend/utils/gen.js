module.exports.genRandomSequence = (length = 16) => {
  let sequence = '';
  const symbols = 'ABCDEFGHIJKLMOPQRSTUVXYZabcdefghijgmlopqrstuvxyz01234567890'

  for (let i = 0; i < length; i += 1) {
    sequence += symbols[parseInt(Math.random() * (symbols.length - 1), 10)];
  }

  return sequence;
};
