export interface IDialogs {
  NONE: string,
  MAP_LIST: string,
  APP_INFO: string,
}

export interface IMapTabs {
  my: string,
  all: string,
  starred: string,
}

export const DIALOGS: IDialogs = ({
  NONE: 'NONE',
  MAP_LIST: 'MAP_LIST',
  APP_INFO: 'APP_INFO',
});

export const TABS: IMapTabs = ({
  my: 'Мои',
  all: 'Заявки',
  starred: 'Каталог',
});
