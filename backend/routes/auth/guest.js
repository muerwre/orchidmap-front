const { genRandomSequence } = require('../../utils/gen');
const { User } = require('../../models');

const generateGuestToken = () => {
  const _id = `guest:${genRandomSequence(16)}`;

  return User.find({ _id }).then(user => {
    if (user.length) return generateGuestToken();

    return _id;
  });
};

const generateUser = (_id, role = 'guest') => {
  const token = `seq:${genRandomSequence(32)}`;

  return { _id, token, role };
};

const saveUser = user => {
  const model = new User({ ...user });

  return model.save()
    .then(() => model.toObject())
    .catch(() => ({
      ...user,
      success: false,
      error: 'Error saving user model',
      error_code: 1232,
    }));
};

const generateRandomUrl = () => Promise.resolve(genRandomSequence(16));

const generateGuest = async () => {
  const user = await generateGuestToken()
    .then(generateUser);
  const random_url = await generateRandomUrl();

  return { ...user, random_url, first_name: '', last_name: '', photo: '' };
};

module.exports = async (req, res) => {
  const user = await generateGuest().then(saveUser);

  res.send({ success: true, ...user });
};

module.exports.generateUser = generateUser;
module.exports.generateGuest = generateGuest;
module.exports.generateGuestToken = generateGuestToken;
module.exports.generateRandomUrl = generateRandomUrl;