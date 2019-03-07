const { User, Route } = require('../../models');

module.exports = async (req, res) => {
  const { body: { id, token, address } } = req;

  const owner = await User.findOne({ _id: id, token }).populate('routes');

  if (!owner) return res.send({ success: false, reason: 'unauthorized' });

  const exists = await Route.findOne({ _id: address }).populate('owner', '_id');

  if (!exists) return res.send({ success: false, mode: 'not_exists' });
  if (exists && exists.owner._id !== id) return res.send({ success: false, mode: 'not_yours' });

  await exists.set({ is_deleted: true }).save();

  return res.send({ success: true, address });
};

