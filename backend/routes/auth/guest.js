const { genRandomSequence } = require('../../utils/gen');
const { User } = require('../../models/User');

const generateGuestToken = () => {
  const id = `guest:${genRandomSequence(16)}`;

  return User.find({ id }).then(user => {
    if (user.length) return generateGuestToken();

    return id;
  });
};

const generateUser = id => {
  const token = `seq:${genRandomSequence(32)}`;
  const role = 'guest';

  return { id, token, role };
};

const saveUser = user => {
  const model = new User({ ...user });

  return model.save();
};

const generateRandomUrl = () => Promise.resolve(genRandomSequence(16));

const generateGuest = async () => {
  const user = await generateGuestToken()
    .then(generateUser);
  const random_url = await generateRandomUrl();

  return { ...user, random_url };
};

module.exports = async (req, res) => {
  const user = await generateGuest();
  await saveUser(user);

  res.send({ success: 'true', ...user });
};

module.exports.generateGuest = generateGuest;
module.exports.generateRandomUrl = generateRandomUrl;
