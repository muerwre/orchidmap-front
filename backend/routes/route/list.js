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
        { title: new RegExp(title.trim(), 'ig') },
        { _id: new RegExp(title.trim(), 'ig') },
      ],
    };
  }

  if (!author || !user || (user._id !== author)) {
    criteria = {
      ...criteria,
      public: true,
    };
  }

  let list = await Route.find(
    {
      ...criteria,
    },
    '_id title distance owner updated_at',
    {
      limit: 500,
      sort: { updated_at: -1 },
    }
  ).populate('owner');

  list = list.filter(item => (
    !author || item.owner._id === author
  ));

  let limits = list.reduce(({ min, max }, { distance: dist }) => ({
    min: Math.ceil(Math.min(dist, min) / 25) * 25,
    max: Math.ceil(Math.max(dist, max) / 25) * 25,
  }), { min: 999999, max: 0 });

  const minDist = parseInt(distance[0], 10);
  const maxDist = parseInt(distance[1], 10) === 200 ? 99999 : parseInt(distance[1], 10);
  // const maxDist = parseInt(distance[1], 10) > parseInt(distance[0], 10)
  //   ? parseInt(distance[1], 10)
  //   : 10000;

  if (distance && distance.length === 2) {
    list = list.filter(item => (
      item.distance >= minDist &&
      item.distance <= maxDist
    ));
  }

  if (list.length === 0) {
    limits = { min: 0, max: 0 };
  } else if (limits.max === 0) {
    limits = { min: 0, max: 0 };
  } else if (limits.min === limits.max) {
    limits = { min: limits.max - 25, max: limits.max };
  } else if (limits.max > 200) {
    limits = { min: limits.min, max: 200 };
  }

  res.send({
    success: true,
    list,
    ...limits,
  });
};

