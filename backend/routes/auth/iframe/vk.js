const { User } = require('../../../models');
const { CONFIG } = require('../../../../config/backend');
const md5 = require('js-md5');
const { generateRandomUrl } = require('../guest');

module.exports = async (req, res) => {
  const { query: { viewer_id, auth_key } } = req;

  const checksum = md5(`${CONFIG.SOCIAL.VK_IFRAME.APP_ID}_${viewer_id}_${CONFIG.SOCIAL.VK_IFRAME.SECRET}`);

  if (checksum !== auth_key) return res.send({ success: false, error: 'cant login or no such user' });

  const user = await User.findOne({ _id: `vk:${viewer_id}` }).populate('routes');

  const random_url = await generateRandomUrl();
  return res.send({ success: true, user: { ...user.toObject(), id: user._id, random_url } });
};

