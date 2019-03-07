const { generateRandomUrl } = require('../auth/guest');
const { Route } = require('../../models');

module.exports = async (req, res) => {
  const { query: { name } } = req;

  if (!name) return res.send({ success: false, mode: 'not_found_1' });

  const exists = await Route.findOne({ _id: name, is_deleted: false }).populate('owner', '_id');

  if (!exists) return res.send({ success: false, mode: 'not_found_2' });
  const data = exists.toObject();
  const random_url = await generateRandomUrl();

  return res.send({
    success: true,
    ...data,
    address: exists._id,
    owner: {
      ...data.owner,
      id: data.owner._id,
    },
    random_url,
  });
};

