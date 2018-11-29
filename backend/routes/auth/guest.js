const { genRandomSequence } = require('../../utils/gen');
const { UserModel } = require('../../config/db');

const generateGuestToken = () => {
  const id = `guest:${genRandomSequence(32)}`;

  return UserModel.find({ id }).then(user => {
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
  const model = new UserModel({ ...user });

  return model.save();
};

module.exports = (req, res) => (
  generateGuestToken()
    .then(generateUser)
    .then(saveUser)
    .then(result => res.send({ success: 'true', type: 'guest', token: result }))
);
