const { User } = require('../../../models');
const axios = require('axios');
const { generateUser } = require('../guest');
const { STRINGS } = require('../../../config/strings');

const fetchUserData = async (req, res) => {
  const { query: { user_id, access_token } } = req;

  const { data } = await axios.get(
    'https://api.vk.com/method/users.get',
    {
      params: {
        user_id,
        fields: 'photo',
        v: '5.67',
        access_token,
      }
    }
  ).catch(() => {
    return res.send({ success: false, error: 'iframe auth failed' });
  });

  return data;
};

module.exports = async (req, res) => {
  const { response } = await fetchUserData(req, res);

  const {
    first_name = '', last_name = '', photo = '', id = ''
  } = response[0];

  console.log('GOT IFRAME USER?', { first_name, last_name, photo, id });

  const newUser = await generateUser(`vk:${id}`, 'vk');
  const name = `${first_name} ${last_name}`;
  const user = {
    ...newUser, first_name, last_name, photo, name,
  };

  const auth = await User.findOne({ _id: user._id }).populate('routes');

  if (auth) {
    await auth.set({
      first_name, last_name, name, photo
    }).save();

    res.send({ success: true, ...user });
  } else {
    const created = await User.create(user, (err, result) => {
      return result.toObject();
    });

    res.send({ success: true, ...user, ...created });
  }
};

