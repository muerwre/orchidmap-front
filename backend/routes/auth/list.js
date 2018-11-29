const { UserModel } = require('../../config/db');

module.exports = (req, res) => UserModel.find((err, articles) => {
  if (!err) return res.send(articles);

  res.statusCode = 500;
  return res.send({ error: 'Server error' });
});

