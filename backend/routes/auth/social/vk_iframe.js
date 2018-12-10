const { User } = require('../../../models');
const axios = require('axios');
const { generateUser } = require('../guest');

const fetchUserData = async (req, res) => {
  const { query: { user_id, access_token } } = req;

  const result = await axios.get(
    'http://api.vk.com/method/users.get',
    {
      params: {
        user_id,
        fields: 'photo',
        v: '5.67',
        access_token,
      }
    }
  ).catch(() => {
    res.send({ success: false, error: 'iframe auth failed' });
  });

  console.log("RESULT!", result);
  const { data } = result;
  if (!data) {
    console.log('OOOPS!', result);
    res.send({ success: false, error: 'iframe auth failed', result });
  }

  return data;
};

module.exports = async (req, res) => {
  const { response } = await fetchUserData(req, res);

  console.log('RESP', response);

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
