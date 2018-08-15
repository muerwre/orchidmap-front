import styled, { css } from 'styled-components';

const vertexMixin = css`
  .leaflet-vertex-icon, .leaflet-middle-icon {
    border-radius: 10px;
    opacity :1;
    border: none;
    width: 16px !important;
    height: 16px !important;margin-left:-8px !important;margin-top:-8px !important;
    background: transparent;
  }
  
  .leaflet-vertex-icon::after, .leaflet-middle-icon::after {
    content: ' ';
    position:absolute;top:4px;left:4px;width:8px;height:8px;
    background:white;border-radius: 8px;transform:scale(1);
    transition:transform 150ms;
  }
  
  .leaflet-vertex-icon:hover, .leaflet-middle-icon:hover {
    opacity: 1 !important;
  }
  
  .leaflet-vertex-icon:hover::after, .leaflet-middle-icon:hover::after,
  .leaflet-vertex-icon:active::after, .leaflet-middle-icon:active::after  {
    transform: scale(2);
    box-shadow: #999 0 0 5px 2px;
  }
`;

const stickers = css`
  .sticker-label {
    width: 48px;
    height: 48px;
    position: absolute;
    background: white;
    border-radius: 32px;
    left: 0;
    top: 0;
  }
  
  .sticker-arrow {
    width: 24px;
    height: 24px;
    position: absolute;
    background: red;
  }
`;

export const MapScreen = styled.div.attrs({ id: 'map' })`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  
  ${vertexMixin}
  ${stickers}
`;
