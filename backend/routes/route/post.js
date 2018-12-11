const { User, Route } = require('../../models');

const { parseRoute, parseStickers, parseString, parseNumber } = require('../../utils/parse');

module.exports = async (req, res) => {
  const { body, body: { id, token, force } } = req;

  const owner = await User.findOne({ _id: id, token }).populate('routes');
  if (!owner) return res.send({ success: false, reason: 'unauthorized', id, token });

  const title = parseString(body.title, 32);
  const address = parseString(body.address, 32);
  const route = parseRoute(body.route);
  const stickers = parseStickers(body.stickers);
  const logo = parseString(body.logo, 16);
  const provider = parseString(body.provider, 16) || 'DEFAULT';
  const distance = parseNumber(body.distance, 0, 1000);

  console.log('SAVING PROVIDER?', provider, body.provider);

  if ((!route || route.length <= 0) && (!stickers || stickers.length <= 0)) {
    return res.send({ success: false, mode: 'empty' });
  }

  const exists = await Route.findOne({ _id: address }).populate('owner', '_id');

  if (exists && exists.owner._id !== id) return res.send({ success: false, mode: 'exists' });
  if (exists && !force) return res.send({ success: false, mode: 'overwriting' });

  if (exists) {
    exists.set({
      title, route, stickers, logo, distance, updated_at: Date.now(), provider,
    }).save();

    return res.send({
      success: true, title, address, route, stickers, mode: 'overwrited'
    });
  }

  const created = await Route.create({
    _id: address, title, route, stickers, owner, logo, distance, provider,
  });

  await owner.routes.push(created);
  await owner.save();

  return res.send({
    success: true, title, address, route, stickers, provider,
  });
};

