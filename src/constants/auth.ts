export interface IRoles {
  guest: string,
  vk: string,
}

export interface IUser {
  new_messages: number,
  place_types: {},
  random_url: string,
  role: IRoles[keyof IRoles],
  routes: {},
  success: boolean,
  id?: string,
  token?: string,
  userdata: {
    name: string,
    agent: string,
    ip: string,
    photo: string,
  }
}

export const ROLES: IRoles = {
  guest: 'guest',
  vk: 'vk',
};

export const DEFAULT_USER: IUser = {
  new_messages: 0,
  place_types: {},
  random_url: '',
  role: ROLES.guest,
  routes: {},
  success: false,
  id: null,
  token: null,
  userdata: {
    name: '',
    agent: '',
    ip: '',
    photo: '',
  }
};
