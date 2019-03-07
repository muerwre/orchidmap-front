const { User, Route } = require('../../models');

const { parseString } = require('../../utils/parse');

module.exports = async (req, res) => {
  const { body, body: { id, token, address } } = req;

  const owner = await User.findOne({ _id: id, token }).populate('routes');

  if (!owner) return res.send({ success: false, reason: 'unauthorized' });

  const title = parseString(body.title, 32);
  const is_public = !!body.is_public;

  const exists = await Route.findOne({ _id: address }).populate('owner', '_id');

  if (!exists) return res.send({ success: false, mode: 'not_exists' });
  if (exists && exists.owner._id !== id) return res.send({ success: false, mode: 'not_yours' });

  exists.set({ title, is_public }).save();

  return res.send({ success: true, ...exists });
};

