const { User, Route } = require('../../models');

module.exports = async (req, res) => {
  const { query: { id, token, name } } = req;

  if (!name) return res.send({ success: false, mode: 'not_found_1' });

  const exists = await Route.findOne({ _id: name }).populate('owner');

  if (!exists) return res.send({ success: false, mode: 'not_found_2' });
  const data = exists.toObject();

  return res.send({
    success: true,
    ...data,
    address: exists._id,
    owner: {
      ...data.owner,
      id: data.owner._id,
    }
  });
};

