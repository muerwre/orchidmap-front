import React from 'react';
import { Map, TileLayer } from 'leaflet';

export const MapContext = React.createContext<Map | undefined>(undefined);
export const TileContext = React.createContext<TileLayer | undefined>(undefined)
