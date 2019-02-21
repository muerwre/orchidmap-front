const ru = [' ','\\.',',',':','\\?','#','Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э'];
const en = ['_','','','','','','Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','','','','','E', 'e'];

export const toHours = (info: number): string => {
  const hrs = parseInt(String(info), 10);
  const min = Math.round((Number(info) - hrs) * 60);
  const lmin = min < 10 ? '0' + min : min;
  return `${hrs}:${lmin}`;
};

export const toTranslit = (string: string): string => (
  ru.reduce((text, el, i) => (text.replace(new RegExp(ru[i], 'g'), en[i])), (String(string) || ''))
);
