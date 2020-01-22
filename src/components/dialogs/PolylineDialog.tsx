import React, { FC, useCallback } from 'react';
import { Icon } from '~/components/panels/Icon';
import { connect } from 'react-redux';
import * as MAP_ACTIONS from '~/redux/map/actions';
import { IState } from '~/redux/store';
import { selectMapRoute } from '~/redux/map/selectors';
import classNames from 'classnames';

const mapStateToProps = (state: IState) => ({
  route: selectMapRoute(state),
});

const mapDispatchToProps = {
  mapSetRoute: MAP_ACTIONS.mapSetRoute,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const PolylineDialogUnconnected: FC<Props> = ({ route, mapSetRoute }) => {
  const reverseRoute = useCallback(() => {
    if (route.length < 2) return;
    mapSetRoute([...route].reverse());
  }, [mapSetRoute, route]);

  const curRouteStart = useCallback(() => {
    if (route.length < 1) return;

    mapSetRoute(route.slice(1, route.length));
  }, [mapSetRoute, route]);

  const curRouteEnd = useCallback(() => {
    if (route.length < 1) return;

    mapSetRoute(route.slice(0, route.length - 1));
  }, [mapSetRoute, route]);

  return (
    <div className="control-dialog control-dialog__medium">
      <div className="helper">
        <div className="helper__text">
          <button
            className={classNames('helper__icon_button', { inactive: route.length < 2 })}
            onClick={reverseRoute}
          >
            <Icon icon="icon-reverse" />
          </button>

          <button
            className={classNames('helper__icon_button', { inactive: route.length < 1 })}
            onClick={curRouteStart}
          >
            <Icon icon="icon-drop-start" />
          </button>

          <button
            className={classNames('helper__icon_button', { inactive: route.length < 1 })}
            onClick={curRouteEnd}
          >
            <Icon icon="icon-drop-end" />
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
