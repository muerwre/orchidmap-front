const { User } = require('../../../models');
const { CONFIG } = require('../../../../config/backend');
const md5 = require('js-md5');
const { generateRandomUrl } = require('../guest');

module.exports = async (req, res) => {
  if (!CONFIG.SOCIAL.VK_IFRAME.ENABLED) return res.send({ success: false, error: 'Unsupported Method' });

  const { query: { viewer_id, auth_key } } = req;

  const checksum = md5(`${CONFIG.SOCIAL.VK_IFRAME.APP_ID}_${viewer_id}_${CONFIG.SOCIAL.VK_IFRAME.SECRET}`);

  if (checksum !== auth_key) return res.send({ success: false, error: 'No such user (1)' });

  const user = await User.findOne({ _id: `vk:${viewer_id}` }).populate('routes');

  if (!user) return res.send({ success: false, error: 'No such user (2)' });

  const random_url = await generateRandomUrl();
  return res.send({ success: true, user: { ...user.toObject(), id: user._id, random_url } });
};

