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

type Path = Array<{ lat: Number, lng: Number }>;
type Stickers = Array<Object>;

export type Route = {
  _id: String,
  title: String,
  version: Number,
  stickers: Array<Stickers>,
  route: Array<Path>,
  logo: String,
  distance: Number,
  created_at: String,
  updated_at: String,
}
