import React from 'react';
import { Map, TileLayer } from 'leaflet';

export const MapContext = React.createContext<Map>(null);
export const TileContext = React.createContext<TileLayer>(null)