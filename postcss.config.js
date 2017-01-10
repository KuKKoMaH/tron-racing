const cssnext = require('postcss-cssnext');

module.exports = {
  plugons: [
    cssnext({
      browsers: ['last 10 versions', 'IE > 8'],
    })
  ]
};