import React, { FC, memo, useEffect, useState } from 'react';
import { KmMarksLayer } from '~/utils/marks';
import { MainMap } from '~/constants/map';
import { selectMap } from '~/redux/map/selectors';
import pick from 'ramda/es/pick';
import { connect } from 'react-redux';
import { IState } from '~/redux/store';

const mapStateToProps = (state: IState) => ({
  map: pick(['route'], selectMap(state)),
});

const mapDispatchToProps = {};
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const KmMarksUnconnected: FC<Props> = memo(({ map: { route } }) => {
  const [layer, setLayer] = useState<KmMarksLayer | null>(null);

  useEffect(() => {
    const layer = new KmMarksLayer([]);
    layer.addTo(MainMap);
    setLayer(layer);
    return () => MainMap.removeLayer(layer);
  }, []);

  useEffect(() => {
    if (!layer) return;

    layer.setLatLngs(route);
  }, [layer, route]);
  return null;
});

const KmMarks = connect(mapStateToProps, mapDispatchToProps)(KmMarksUnconnected);

export { KmMarks };
