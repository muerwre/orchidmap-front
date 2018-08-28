export const ROLES = {
  guest: 'guest',
  vk: 'vk',
};

export const DEFAULT_USER = {
  new_messages: 0,
  place_types: {},
  random_url: '',
  role: ROLES.guest,
  routes: [],
  success: false,
  userdata: {
    name: '',
    agent: '',
    ip: '',
    photo: '',
  }
};
