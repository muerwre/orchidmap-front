const { User } = require('../../models');

module.exports = (req, res) => User.find((err, articles) => {
  if (!err) return res.send(articles);

  res.statusCode = 500;
  return res.send({ error: 'Server error' });
});

