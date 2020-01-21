import React, { FC } from 'react';
import { connect } from 'react-redux';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  editorClearPoly: EDITOR_ACTIONS.editorClearPoly,
  editorClearStickers: EDITOR_ACTIONS.editorClearStickers,
  editorClearAll: EDITOR_ACTIONS.editorClearAll,
  editorClearCancel: EDITOR_ACTIONS.editorClearCancel,
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    width: number;
  };

const TrashDialogUnconnected: FC<Props> = ({
  editorClearPoly,
  editorClearStickers,
  editorClearAll,
  editorClearCancel,
  width,
}) => (
  <div className="control-dialog control-dialog__medium" style={{ width }}>
    <div className="helper trash-helper desktop-only">
      <div className="helper__text danger">
        <div className="big upper desktop-only">Все изменения будут удалены!</div>
      </div>
    </div>
    <div className="helper trash-helper">
      <div className="helper__buttons flex_1 trash-buttons">
        <div className="button-group">
          <div className="button router-helper__button" onClick={editorClearPoly}>
            Маршрут
          </div>
          
          <div className="button router-helper__button" onClick={editorClearStickers}>
            Стикеры
          </div>

          <div className="button router-helper__button" onClick={editorClearAll}>
            ВСЕ
          </div>
        </div>

        <div className="flex_1" />

        <div className="button primary router-helper__button" onClick={editorClearCancel}>
          Отмена
        </div>
      </div>
    </div>
  </div>
);

const TrashDialog = connect(mapStateToProps, mapDispatchToProps)(TrashDialogUnconnected);

export { TrashDialog };
