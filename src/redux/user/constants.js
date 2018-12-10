// @flow

export const ACTIONS = ({
  SET_USER: 'SET_USER',
  USER_LOGOUT: 'USER_LOGOUT',

  SET_EDITING: 'SET_EDITING',
  SET_MODE: 'SET_MODE',
  SET_DISTANCE: 'SET_DISTANCE',
  SET_CHANGED: 'SET_CHANGED',
  SET_ROUTER_POINTS: 'SET_ROUTER_POINTS',
  SET_ACTIVE_STICKER: 'SET_ACTIVE_STICKER',
  SET_LOGO: 'SET_LOGO',
  SET_TITLE: 'SET_TITLE',
  SET_ADDRESS: 'SET_ADDRESS',

  START_EDITING: 'START_EDITING',
  STOP_EDITING: 'STOP_EDITING',

  ROUTER_CANCEL: 'ROUTER_CANCEL',
  ROUTER_SUBMIT: 'ROUTER_SUBMIT',

  CLEAR_POLY: 'CLEAR_POLY',
  CLEAR_STICKERS: 'CLEAR_STICKERS',
  CLEAR_ALL: 'CLEAR_ALL',
  CLEAR_CANCEL: 'CLEAR_CANCEL',

  SEND_SAVE_REQUEST: 'SEND_SAVE_REQUEST',
  CANCEL_SAVE_REQUEST: 'CANCEL_SAVE_REQUEST',
  RESET_SAVE_DIALOG: 'RESET_SAVE_DIALOG',

  SET_SAVE_SUCCESS: 'SET_SAVE_SUCCESS',
  SET_SAVE_ERROR: 'SET_SAVE_ERROR',
  SET_SAVE_OVERWRITE: 'SET_SAVE_OVERWRITE',

  SHOW_RENDERER: 'SHOW_RENDERER',
  HIDE_RENDERER: 'HIDE_RENDERER',
  SET_RENDERER: 'SET_RENDERER',
  TAKE_A_SHOT: 'TAKE_A_SHOT',
  CROP_A_SHOT: 'CROP_A_SHOT',

  SET_PROVIDER: 'SET_PROVIDER',

  SET_DIALOG: 'SET_DIALOG',
  SET_DIALOG_ACTIVE: 'SET_DIALOG_ACTIVE',
  LOCATION_CHANGED: 'LOCATION_CHANGED',
  SET_READY: 'SET_READY',

  GOT_VK_USER: 'GOT_VK_USER',
  KEY_PRESSED: 'KEY_PRESSED',

  IFRAME_LOGIN_VK: 'IFRAME_LOGIN_VK',
}: { [key: String]: String });
