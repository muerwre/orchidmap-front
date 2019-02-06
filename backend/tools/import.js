#!/usr/bin/env node
const mysql = require('mysql');
const { REPLACEMENT, MAPS } = require('./stickersReplacement');
const db = require('../config/db');
let total_dist = 0;
const { User, Route } = require('../models');

const con = mysql.createConnection({
  host: 'vault48.org',
  user: 'macos_exporter',
  password: 'password',
});

const tryJSON = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

const findDistance = (t1, n1, t2, n2) => {
  // convert coordinates to radians
  const lat1 = deg2rad(t1);
  const lon1 = deg2rad(n1);
  const lat2 = deg2rad(t2);
  const lon2 = deg2rad(n2);

  // find the differences between the coordinates
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  // here's the heavy lifting
  const a = (Math.sin(dlat / 2) ** 2) +
    (Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon / 2) ** 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
  // const dm = c * 3961; // great circle distance in miles
  const dk = c * 6373; // great circle distance in km

  // round the results down to the nearest 1/1000
  // const mi = round(dm);
  return (Math.round(dk * 1000) / 1000);
};

const calcPolyDistance = route => {
  let summ = 0;
  for (let i = 1; i < route.length; i += 1) {
    summ += findDistance(route[i - 1].lat, route[i - 1].lng, route[i].lat, route[i].lng);
  }

  total_dist += summ;

  return parseFloat(Number(summ).toFixed(2));
};

const stickerAngleParser = angle => parseFloat((Number(angle) - Math.PI).toFixed(2));

const stickerStyleParser = style => (REPLACEMENT[style]
  ? { ...REPLACEMENT[style] }
  : { set: 'base', sticker: 'chicken' });

const stickersParser = stickers => (
  stickers.map(({
    ang, latlng, style, text
  }) => ({
    angle: stickerAngleParser(ang), // todo: change it!
    latlng,
    text,
    ...stickerStyleParser(style),
  }))
);

const pointParser = points => (
  points.map(({ latlngs, text }) => ({
    text,
    latlng: latlngs[0],
    set: 'base',
    sticker: 'empty',
    angle: 2.2,
  }))
);

const mapStyleParser = style => (MAPS[style]
  ? MAPS[style]
  : 'DEFAULT'
);

const run = async () => {
  await con.connect(err => { if (err) throw err; });
  await con.query('use neu_map');

  const users = await new Promise(resolve => con.query('SELECT * from tokens where role = "vk"', (err, rows) => {
    resolve(rows.map(({
      login, token, created, role, data
    }) => {
      const info = tryJSON(data);
      const created_at = new Date(created * 1000);

      return {
        _id: login,
        token,
        created_at,
        updated_at: created_at,
        name: info.name,
        first_name: (info.name && info.name.split(' ')[0]) || '',
        last_name: (info.name && info.name.split(' ')[1]) || '',
        role,
        photo: info.photo,
        version: 1,
      };
    }));
  }));

  const routes = await new Promise(resolve => con.query('SELECT routes.*, tokens.login as login from routes LEFT JOIN tokens ON tokens.id = routes.id WHERE tokens.login IS NOT NULL AND tokens.role="vk"', (err, rows) => {
    if (err) console.log('error', err);

    resolve(rows.map(({
      data, created, name, login
    }) => {
      const {
        map_style, route, stickers, points, logo
      } = tryJSON(data);
      const created_at = new Date(created * 1000);

      return {
        _id: name,
        owner: { _id: login },
        created_at,
        updated_at: created_at,
        provider: mapStyleParser(map_style),
        route: route.map(({ lat, lng }) => ({ lat: Number(lat), lng: Number(lng) })),
        stickers: [
          ...stickersParser(stickers),
          ...pointParser(points)
        ],
        logo: logo === 'default' ? 'nvs' : logo,
        title: '',
        version: 1,
        distance: calcPolyDistance(route),
        is_public: true,
      };
    }));
  }));

  console.log('ended, got users:', users.length);
  console.log('ended, got routes:', routes.length);

  const deletedUsers = await User.deleteMany({
    // version: 1
  });
  const deletedRoutes = await Route.deleteMany({
    // version: 1
  });
  console.log("dropped users", deletedUsers);
  console.log("dropped routes", deletedRoutes);
  console.log('inserting users');
  const addedUsers = (await Promise.all(users.map(user => User.create(user))))
    .reduce((obj, user) => ({ ...obj, [user._id]: user }), {});

  console.log('inserting routes');
  const addedRoutes = await (await Promise.all(routes.map(route => Route.create({
    ...route,
    owner: addedUsers[route.owner._id],
  }))));

  await Promise.all(addedRoutes.map(async (route) => {
    await addedUsers[route.owner._id].routes.push(route);
  }));

  await Promise.all(addedRoutes.map(route => new Promise(resolve => (
    addedUsers[route.owner._id].save(() => resolve())
  ))));

  console.log('ok');
};

run();

