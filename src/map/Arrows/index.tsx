import { FC, memo, useState, useEffect } from 'react';
import { MainMap } from '~/constants/map';
import { connect } from 'react-redux';
import { IState } from '~/redux/store';
import { selectMapRoute } from '~/redux/map/selectors';
import { ArrowsLayer } from '~/utils/map/ArrowsLayer';

const mapStateToProps = (state: IState) => ({
  route: selectMapRoute(state),
});

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const ArrowsUnconnected: FC<Props> = memo(({ route }) => {
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    const item = new ArrowsLayer({}).addTo(MainMap);
    setLayer(item);    
    return () => MainMap.removeLayer(item);
  }, [MainMap]);

  useEffect(() => {
    if (!layer) return
    
    layer.setLatLngs(route);
  }, [layer, route])
  return null;
});

const Arrows = connect(mapStateToProps, mapDispatchToProps)(ArrowsUnconnected);

export { Arrows };
