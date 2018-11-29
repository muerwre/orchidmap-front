const { User } = require('../../../models/User');
const axios = require('axios');
const { generateGuest, generateRandomUrl, generateUser } = require('../guest');
//
// const generateTokenUrl = (host, code) => (
//   `https://oauth.vk.com/access_token?client_id=5987644&redirect_uri=http://${host}/` +
//   `auth/social/vk&client_secret=Z71DsxoMF7PS9kayLuks&code=${code}`
// );

const fetchUserData = async (req) => {
  const { query: { code } } = req;
  const host = req.get('host');

  const { data: { access_token, user_id } } = await axios.get(
    'https://oauth.vk.com/access_token',
    {
      params: {
        client_id: 5987644,
        client_secret: 'Z71DsxoMF7PS9kayLuks',
        code,
        redirect_uri: `http://${host}/auth/social/vk`,
      }
    }
  ).catch(() => ({ data: { } }));

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
  ).catch(() => ({ data: { response: [] } }));

  return data;
};

module.exports = async (req, res) => {
  const { response } = await fetchUserData(req);

  const {
    first_name = '', last_name = '', photo = '', id = ''
  } = response[0];

  const newUser = await generateUser(`vk:${id}`, 'vk');
  const user = {
    ...newUser, first_name, last_name, photo
  };

  // todo: error handling
  // console.log('USE', user);

  res.send(user);
};

