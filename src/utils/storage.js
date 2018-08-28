const canStore = typeof window.localStorage !== 'undefined'

export const storeData = (key, data) => {
  if (!canStore) return;

  const value = JSON.stringify(data);

  localStorage.setItem(key, value);
};

export const getData = key => {
  if (!canStore) return;

  let result = null;

  try {
    result = JSON.parse(localStorage.getItem(key));
  } catch(e) {
    result = null;
  }

  if (!result) return;

  return result;
};
