import React, { FC, useCallback } from 'react';
import { Icon } from '~/components/panels/Icon';
import { connect } from 'react-redux';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import * as MAP_ACTIONS from '~/redux/map/actions';
import { IState } from '~/redux/store';
import { selectMapRoute } from '~/redux/map/selectors';

const mapStateToProps = (state: IState) => ({
  route: selectMapRoute(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const PolylineDialogUnconnected: FC<Props> = ({ route, mapSetRoute }) => {
  const reverseRoute = useCallback(() => {
    mapSetRoute([...route].reverse());
  }, [mapSetRoute, route]);
  
  const curRouteStart = useCallback(() => {
    mapSetRoute(route.slice(1, route.length));
  }, [mapSetRoute, route]);
  
  const curRouteEnd = useCallback(() => {
    mapSetRoute(route.slice(0, route.length - 1));
  }, [mapSetRoute, route]);

  return (
    <div className="control-dialog control-dialog__medium">
      <div className="helper">
        <div className="helper__text">
          <button className="helper__icon_button" onClick={reverseRoute}>
            <Icon icon="icon-reverse" />
          </button>

          <button className="helper__icon_button" onClick={curRouteStart}>
            <Icon icon="icon-pin-1" />
          </button>

          <button className="helper__icon_button" onClick={curRouteEnd}>
            <Icon icon="icon-pin-1" />
          </button>

          <div className="flex_1" />

          <div className="big white upper">Ручной режим</div>
        </div>
      </div>
    </div>
  );
};

const PolylineDialog = connect(mapStateToProps, mapDispatchToProps)(PolylineDialogUnconnected);

export { PolylineDialog };
