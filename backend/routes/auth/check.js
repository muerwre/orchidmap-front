const { User } = require('../../models/User');
const { generateGuest, generateRandomUrl } = require('./guest');

module.exports = async (req, res) => {
  const { id, token } = req.query;
  console.log(req.query);
  console.log('SEARCHING', id, token);

  const user = await User.findOne({ _id: id, token });
  const random_url = await generateRandomUrl();

  if (user) {
    console.log('FOUND');
    return res.send({ success: true, ...user.toObject(), id: user._id, random_url });
  }

  const guest = await generateGuest();
  const created = await User.create(guest).then(result => result.toObject());

  return res.send({
    success: false, error: 'user not found', error_code: 1231, ...created, id: created._id, random_url
  });
};

