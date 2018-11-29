const { User } = require('../../models/User');
const { generateGuest, generateRandomUrl } = require('./guest');

module.exports = async (req, res) => {
  const { id, token } = req.query;
  const user = await User.find({ id, token });
  const random_url = await generateRandomUrl();

  if (user.length > 0) {
    return res.send({ success: true, ...user[0].toObject() });
  }

  const guest = await generateGuest();
  return res.send({
    success: false, error: 'user not found', error_code: 1231, ...guest, random_url
  });
};

