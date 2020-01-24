import { FC, useEffect, useState } from 'react';
import { Polyline, LatLngLiteral } from 'leaflet';
import { MainMap } from '~/constants/map';

interface IProps {
  latlngs: LatLngLiteral[];
  color: string;
}

const GpxPolyline: FC<IProps> = ({ latlngs, color }) => {
  const [layer, setLayer] = useState<Polyline>(null);

  useEffect(() => {
    const item = new Polyline([], {
      color,
      stroke: true,
      opacity: 1,
      weight: 9,
      dashArray: [12,12],
    }).addTo(MainMap);
    setLayer(item);

    return () => MainMap.removeLayer(item);
  }, [MainMap]);

  useEffect(() => {
    if (!layer) return;

    layer.setLatLngs(latlngs);
    layer.setStyle({ color });
  }, [latlngs, layer, color]);

  return null;
};

export { GpxPolyline };
