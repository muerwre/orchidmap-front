const { User } = require('../../../models');
const axios = require('axios');
const { generateUser } = require('../guest');
const { STRINGS } = require('../../../config/strings');
const { CONFIG } = require('../../../../config/backend');

const fetchUserData = async (req, res) => {
  const { query: { code } } = req;
  const host = req.get('host');

  const { data: { access_token, user_id } } = await axios.get(
    'https://oauth.vk.com/access_token',
    {
      params: {
        client_id: CONFIG.SOCIAL.VK.APP_ID,
        client_secret: CONFIG.SOCIAL.VK.SECRET,
        code,
        redirect_uri: `http://${host}/auth/social/vk`,
      }
    }
  ).catch(err => {
    console.log('[SOCIAL] error:', err);

    return res.render('social/vk_error', {
      title: STRINGS.OAUTH.ERROR_TITLE,
      heading: STRINGS.OAUTH.ERROR_HEADING,
      reason: STRINGS.OAUTH.ERROR_TEXT,
      button: STRINGS.OAUTH.ERROR_CLOSE_BUTTON,
    });
  });

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
  ).catch(err => {
    console.log('[SOCIAL] error:', err);

    return res.render('social/vk_error', {
      title: STRINGS.OAUTH.ERROR_TITLE,
      heading: STRINGS.OAUTH.ERROR_HEADING,
      reason: STRINGS.OAUTH.ERROR_TEXT,
      button: STRINGS.OAUTH.ERROR_CLOSE_BUTTON,
    });
  });

  return data;
};

module.exports = async (req, res) => {
  const { response } = await fetchUserData(req, res);

  const {
    first_name = '', last_name = '', photo = '', id = ''
  } = response[0];

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

    res.render('social/success', { title: STRINGS.OAUTH.SUCCESS_TITLE, ...user, token: auth.token });
  } else {
    const created = await User.create(user, (err, result) => {
      return result.toObject();
    });

    res.render('social/success', { title: STRINGS.OAUTH.SUCCESS_TITLE, ...user, ...created });
  }
};

