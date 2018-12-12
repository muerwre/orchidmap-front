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

  const list = await Route.find({
    ...criteria,
    distance: {
      $gte: parseInt(distance[0], 10),
      $lte: parseInt(distance[1], 10),
    },
    public: true,
  }, '_id title distance owner updated_at', { limit: 500 }).populate('owner');


  const filtered = list.filter(item => (
    !author || item.owner._id === author
  ));

  res.send({
    success: true,
    list: filtered,
  });
};

