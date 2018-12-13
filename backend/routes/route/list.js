const { Route, User } = require('../../models');

module.exports = async (req, res) => {
  const {
    query: {
      id, token, title, distance, author, starred,
    }
  } = req;

  const user = await User.findOne({ _id: id, token });

  let criteria = {};

  if (title) {
    criteria = {
      ...criteria,
      $or: [
        { title: new RegExp(title, 'ig') },
        { _id: new RegExp(title, 'ig') },
      ],
    };
  }

  if (!author || !user || (user._id !== author)) {
    criteria = {
      ...criteria,
      public: true,
    };
  }

  let list = await Route.find({
    ...criteria,
  }, '_id title distance owner updated_at', { limit: 500 }).populate('owner');

  list = list.filter(item => (
    !author || item.owner._id === author
  ));

  const limits = list.reduce(({ min, max }, { distance: dist }) => ({
    min: Math.ceil(Math.min(dist, min) / 20) * 20,
    max: Math.ceil(Math.max(dist, max) / 20) * 20,
  }), { min: 0, max: 0 });

  if (distance && distance.length === 2) {
    list = list.filter(item => (
      item.distance >= parseInt(distance[0], 10) &&
      item.distance <= parseInt(distance[1], 10)
    ));
  }

  res.send({
    success: true,
    list,
    ...limits,
  });
};

