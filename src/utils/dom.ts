export const getStyle = (oElm: any, strCssRule: string): string => {
  if(document.defaultView && document.defaultView.getComputedStyle){
    return document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule);
  } else if(oElm.currentStyle){
    return oElm.currentStyle[strCssRule.replace(/\-(\w)/g, (strMatch, p1) => p1.toUpperCase())];
  }

  return '';
};


export const getRandomColor = () => {
  return `hsla(${(Math.floor(Math.random() * 360))}, 100%, 50%, 0.4)`
}

export const getAdaptiveScale = (zoom: number): number => (
  Math.min(1, Math.max(0.4, 1 / (2 ** (13 - zoom))))
);