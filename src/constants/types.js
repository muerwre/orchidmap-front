import { ROLES } from '$constants/auth';

export type UserType = {
  new_messages: Number,
  place_types: Object,
  random_url: String,
  role: String,
  routes: Array<Object>,
  success: Boolean,
  id: String,
  token: String,
  userdata: {
    name: String,
    agent: String,
    ip: String,
    photo: String,
  }
};
