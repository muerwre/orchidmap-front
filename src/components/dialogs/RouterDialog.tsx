import React, { FC } from 'react';
import { Icon } from '~/components/panels/Icon';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { selectEditor } from '~/redux/editor/selectors';
import pick from 'ramda/es/pick';

const noPoints = ({
  editorRouterCancel,
}: {
  editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel;
}) => (
  <React.Fragment>
    <div className="helper router-helper">
      <div className="helper__text">
        <Icon icon="icon-pin-1" />
        <div className="big white upper">Укажите первую точку на карте</div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons flex_1">
        <div className="flex_1" />
        <div className="button router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const firstPoint = ({
  editorRouterCancel,
}: {
  editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel;
}) => (
  <React.Fragment>
    <div className="helper router-helper">
      <div className="helper__text">
        <Icon icon="icon-pin-1" />
        <div className="big white upper">УКАЖИТЕ СЛЕДУЮЩУЮ ТОЧКУ</div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons flex_1">
        <div className="flex_1" />
        <div className="button router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
      </div>
    </div>
  </React.Fragment>
);

const draggablePoints = ({
  editorRouterCancel,
  editorRouterSubmit,
}: {
  editorRouterCancel: typeof EDITOR_ACTIONS.editorRouterCancel;
  editorRouterSubmit: typeof EDITOR_ACTIONS.editorRouterSubmit;
}) => (
  <React.Fragment>
    <div className="helper">
      <div className="helper__text success">
        <Icon icon="icon-check-1" />
        <div className="big upper">Продолжайте маршрут</div>
      </div>
    </div>
    <div className="helper router-helper">
      <div className="helper__buttons button-group flex_1">
        <div className="flex_1" />
        <div className="button button_red router-helper__button" onClick={editorRouterCancel}>
          Отмена
        </div>
        <div className="button primary router-helper__button" onClick={editorRouterSubmit}>
          Применить
        </div>
      </div>
    </div>
  </React.Fragment>
);

const mapStateToProps = state => ({
  editor: pick(['router'], selectEditor(state)),
});

const mapDispatchToProps = {
  editorRouterCancel: EDITOR_ACTIONS.editorRouterCancel,
  editorRouterSubmit: EDITOR_ACTIONS.editorRouterSubmit,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { };

const RouterDialogUnconnected: FC<Props> = ({
  editor: {
    router: { waypoints },
    is_routing,
  },
  editorRouterCancel,
  editorRouterSubmit,
}) => (
  <div className="control-dialog bottom right">
    <div className={classnames('save-loader', { active: is_routing })} />

    {!waypoints.length && noPoints({ editorRouterCancel })}
    {waypoints.length === 1 && firstPoint({ editorRouterCancel })}
    {waypoints.length >= 2 && draggablePoints({ editorRouterCancel, editorRouterSubmit })}
  </div>
);

const RouterDialog = connect(mapStateToProps, mapDispatchToProps)(RouterDialogUnconnected);

export { RouterDialog };
