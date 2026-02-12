module.exports = {
  plugins: [
    require('postcss-prefixer')({
      prefix: 'veripass-',
      ignore: [], // Add selectors to ignore if needed (e.g. ['body', 'html'] if processed)
    }),
  ],
};
