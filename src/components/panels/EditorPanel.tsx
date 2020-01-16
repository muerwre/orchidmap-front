import React, { PureComponent } from 'react';
import { MODES } from '~/constants/modes';
import classnames from 'classnames';

import { Icon } from '~/components/panels/Icon';
import { EditorDialog } from '~/components/panels/EditorDialog';
import { connect } from 'react-redux';
import {
  editorSetMode,
  editorStartEditing,
  editorStopEditing,
  editorTakeAShot,
  editorKeyPressed,
} from '~/redux/editor/actions';
import { Tooltip } from '~/components/panels/Tooltip';
import { IState } from '~/redux/store';
import { selectEditor } from '~/redux/editor/selectors';
import pick from 'ramda/es/pick';

const mapStateToProps = (state: IState) =>
  pick(['mode', 'changed', 'editing', 'features'], selectEditor(state));

const mapDispatchToProps = {
  editorSetMode,
  editorStartEditing,
  editorStopEditing,
  editorTakeAShot,
  editorKeyPressed,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

class EditorPanelUnconnected extends PureComponent<Props, void> {
  componentDidMount() {
    window.addEventListener('keydown', this.props.editorKeyPressed as any);

    const obj = document.getElementById('control-dialog');
    const { width } = this.panel.getBoundingClientRect();

    if (!this.panel || !obj) return;

    obj.style.width = String(width);
  }

  panel: HTMLElement = null;

  componentWillUnmount() {
    window.removeEventListener('keydown', this.props.editorKeyPressed as any);
  }

  startPolyMode = () => this.props.editorSetMode(MODES.POLY);
  startStickerMode = () => this.props.editorSetMode(MODES.STICKERS_SELECT);
  startRouterMode = () => this.props.editorSetMode(MODES.ROUTER);
  startTrashMode = () => this.props.editorSetMode(MODES.TRASH);
  startSaveMode = () => {
    this.props.editorSetMode(MODES.SAVE);
  };

  render() {
    const {
      mode,
      changed,
      editing,
      features: { routing },
    } = this.props;

    return (
      <div>
        <div
          className={classnames('panel right', { active: editing })}
          ref={el => {
            this.panel = el;
          }}
        >
          <div className="control-bar control-bar-padded">
            {routing && (
              <button
                className={classnames({ active: mode === MODES.ROUTER })}
                onClick={this.startRouterMode}
              >
                <Tooltip>Автоматический маршрут</Tooltip>
                <Icon icon="icon-route-2" />
              </button>
            )}

            <button
              className={classnames({ active: mode === MODES.POLY })}
              onClick={this.startPolyMode}
            >
              <Tooltip>Редактирование маршрута</Tooltip>
              <Icon icon="icon-poly-3" />
            </button>

            <button
              className={classnames({
                active: mode === MODES.STICKERS || mode === MODES.STICKERS_SELECT,
              })}
              onClick={this.startStickerMode}
            >
              <Tooltip>Точки маршрута</Tooltip>
              <Icon icon="icon-sticker-3" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar control-bar-padded">
            <button
              className={classnames({ active: mode === MODES.TRASH })}
              onClick={this.startTrashMode}
            >
              <Tooltip>Удаление элементов</Tooltip>
              <Icon icon="icon-trash-6" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button className="highlighted cancel" onClick={this.props.editorStopEditing}>
              <Icon icon="icon-cancel-1" />
            </button>

            <button
              className={classnames({ primary: changed, inactive: !changed })}
              onClick={this.startSaveMode}
            >
              <span className="desktop-only">СОХРАНИТЬ</span>
              <Icon icon="icon-check-1" />
            </button>
          </div>
        </div>

        <div className={classnames('panel right', { active: !editing })}>
          <div className="control-bar">
            <button className="primary single" onClick={this.props.editorStartEditing}>
              <Icon icon="icon-route-2" />
              <span>РЕДАКТИРОВАТЬ</span>
            </button>
          </div>
        </div>

        <EditorDialog width={(this.panel && this.panel.getBoundingClientRect().width) || 0} />
      </div>
    );
  }
}

export const EditorPanel = connect(mapStateToProps, mapDispatchToProps)(EditorPanelUnconnected);
