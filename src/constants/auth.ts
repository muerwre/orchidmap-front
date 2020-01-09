export interface IRoles {
  guest: string;
  vk: string;
  admin: string;
}

export interface IUser {
  new_messages: number;
  place_types: {};
  random_url: string;
  role: IRoles[keyof IRoles];
  routes: {};
  success: boolean;
  id?: string;
  uid: string;
  token?: string;
  photo: string;
  name: string;
}

export const ROLES: IRoles = {
  guest: "guest",
  vk: "vk",
  admin: "admin"
};

export const DEFAULT_USER: IUser = {
  new_messages: 0,
  place_types: {},
  random_url: "",
  role: ROLES.guest,
  routes: {},
  success: false,
  id: null,
  token: null,
  photo: null,
  name: null,
  uid: null,
};
