const { User, Route } = require('../../models');

module.exports = async (req, res) => {
  const { body, body: { id, token, address } } = req;

  const owner = await User.findOne({ _id: id, token }).populate('routes');

  if (!owner || owner.role !== 'admin') return res.send({ success: false, reason: 'unauthorized' });

  const is_starred = !!body.is_starred;

  const exists = await Route.findOne({ _id: address }).populate('owner', '_id');
  if (!exists) return res.send({ success: false, mode: 'not_exists' });

  await exists.set({ is_starred }).save();

  return res.send({ success: true, ...exists });
};

