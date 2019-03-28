export const getStyle = (oElm: any, strCssRule: string): string => {
  if(document.defaultView && document.defaultView.getComputedStyle){
    return document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);
  } else if(oElm.currentStyle){
    return oElm.currentStyle[strCssRule.replace(/\-(\w)/g, (strMatch, p1) => p1.toUpperCase())];
  }

  return '';
};
