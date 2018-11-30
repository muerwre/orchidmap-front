export const SERVER = 'http://alpha-map.vault48.org';
export const TEST = 'http://localhost:3000';

export const API = {
  COMPOSE: `${SERVER}/engine/composerOrchid.php`,
  GET_GUEST: `${TEST}/auth`,
  CHECK_TOKEN: `${TEST}/auth`,
  GET_MAP: `${SERVER}/engine/authOrchid.php`,
  POST_MAP: `${SERVER}/engine/authOrchid.php?action=store`,
};
