module.exports = {
  plugins: [
    require('postcss-prefixer')({
      prefix: 'veripass-',
      ignore: [],
    }),
  ],
};
