const mongoose = require('mongoose');

const { UserSchema } = require('./User');
const { RouteSchema } = require('./Route');

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Route = mongoose.model('Route', RouteSchema);

