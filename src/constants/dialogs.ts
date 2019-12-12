export interface IDialogs {
  NONE: string,
  MAP_LIST: string,
  APP_INFO: string,
}

export interface IMapTabs {
  MY: string,
  PENDING: string,
  STARRED: string,
}

export const DIALOGS: IDialogs = ({
  NONE: 'NONE',
  MAP_LIST: 'MAP_LIST',
  APP_INFO: 'APP_INFO',
});

export const TABS: IMapTabs = {
  MY: 'my',
  PENDING: 'pending',
  STARRED: 'starred',
}

export const TABS_TITLES = ({
  [TABS.MY]: 'Мои',
  [TABS.PENDING]: 'Заявки',
  [TABS.STARRED]: 'Каталог',
});
