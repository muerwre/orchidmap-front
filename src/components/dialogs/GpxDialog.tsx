import React, { FC, useCallback, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { IState } from '~/redux/store';
import { selectEditorGpx } from '~/redux/editor/selectors';
import { GpxDialogRow } from '~/components/gpx/GpxDialogRow';
import { MainMap } from '~/constants/map';
import { latLngBounds } from 'leaflet';
import { Switch } from '../Switch';
import { selectMapRoute, selectMapTitle, selectMapAddress } from '~/redux/map/selectors';
import classNames from 'classnames';
import uuid from 'uuid';
import { getUrlData } from '~/utils/history';
import { getRandomColor } from '~/utils/dom';

const mapStateToProps = (state: IState) => ({
  gpx: selectEditorGpx(state),
  route: selectMapRoute(state),
  title: selectMapTitle(state),
  address: selectMapAddress(state),
});

const mapDispatchToProps = {
  editorDropGpx: EDITOR_ACTIONS.editorDropGpx,
  editorUploadGpx: EDITOR_ACTIONS.editorUploadGpx,
  editorSetGpx: EDITOR_ACTIONS.editorSetGpx,
  editorGetGPXTrack: EDITOR_ACTIONS.editorGetGPXTrack,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const GpxDialogUnconnected: FC<Props> = ({
  title,
  address,
  gpx,
  route,
  editorGetGPXTrack,
  editorSetGpx,
  editorUploadGpx,
}) => {
  const onGpxUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target || !event.target.files || event.target.files.length === 0) {
        return;
      }

      editorUploadGpx(event.target.files[0]);
    },
    [editorUploadGpx]
  );

  const onFocusRoute = useCallback(
    index => {
      if (!gpx.list[index] || !gpx.list[index].latlngs) return;

      const bounds = latLngBounds(gpx.list[index].latlngs);
      MainMap.fitBounds(bounds);
    },
    [gpx, MainMap]
  );

  const onRouteDrop = useCallback(
    index => {
      editorSetGpx({ list: gpx.list.filter((el, i) => i !== index) });
    },
    [gpx, editorSetGpx]
  );

  const onRouteColor = useCallback(
    index => {
      if (!gpx.enabled) return;
      editorSetGpx({
        list: gpx.list.map((el, i) => (i !== index ? el : { ...el, color: getRandomColor() })),
      });
    },
    [gpx, editorSetGpx]
  );

  const toggleGpx = useCallback(() => {
    editorSetGpx({ enabled: !gpx.enabled });
  }, [gpx, editorSetGpx]);

  const onRouteToggle = useCallback(
    index => {
      if (!gpx.enabled) return;
      editorSetGpx({
        list: gpx.list.map((el, i) => (i !== index ? el : { ...el, enabled: !el.enabled })),
      });
    },
    [gpx, editorSetGpx]
  );

  const addCurrent = useCallback(() => {
    if (!route.length) return;

    const { path } = getUrlData();

    editorSetGpx({
      list: [
        ...gpx.list,
        {
          latlngs: route,
          enabled: false,
          name: title || address || path,
          id: uuid(),
          color: getRandomColor(),
        },
      ],
    });
  }, [route, gpx, editorSetGpx]);

  return (
    <div className="control-dialog control-dialog__left control-dialog__small">
      <div className="gpx-title">
        <div className="flex_1 big white upper">Треки</div>
        <Switch active={gpx.enabled} onPress={toggleGpx} />
      </div>

      {gpx.list.map((item, index) => (
        <GpxDialogRow
          item={item}
          key={item.id}
          index={index}
          enabled={gpx.enabled}
          onRouteDrop={onRouteDrop}
          onFocusRoute={onFocusRoute}
          onRouteToggle={onRouteToggle}
          onRouteColor={onRouteColor}
        />
      ))}

      <div className="gpx-buttons">
        <button className="button outline">
          <input type="file" onChange={onGpxUpload} />
          Загрузить GPX
        </button>

        <div
          className={classNames('button outline', { disabled: !route.length })}
          onClick={addCurrent}
        >
          Добавить текущий
        </div>

        <div
          className={classNames('button success', { disabled: !route.length })}
          onClick={editorGetGPXTrack}
        >
          Скачать текущий
        </div>
      </div>
    </div>
  );
};

const GpxDialog = connect(mapStateToProps, mapDispatchToProps)(GpxDialogUnconnected);

export { GpxDialog };
