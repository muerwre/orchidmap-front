import React, { PureComponent } from 'react';
import { MODES } from '~/constants/modes';
import classnames from 'classnames';

import { Icon } from '~/components/panels/Icon';
import { EditorDialog } from '~/components/panels/EditorDialog';
import { connect } from 'react-redux';
import {
  editorChangeMode,
  editorKeyPressed,
  editorRedo,
  editorStartEditing,
  editorStopEditing,
  editorTakeAShot,
  editorUndo,
} from '~/redux/editor/actions';
import { Tooltip } from '~/components/panels/Tooltip';
import { IState } from '~/redux/store';
import { selectEditor } from '~/redux/editor/selectors';
import { selectMap } from '~/redux/map/selectors';

const mapStateToProps = (state: IState) => {
  const { mode, changed, editing, features, history } = selectEditor(state);
  const { route, stickers } = selectMap(state);
  return {
    mode,
    changed,
    editing,
    features,
    history,
    route,
    stickers,
  };
};

const mapDispatchToProps = {
  editorChangeMode,
  editorStartEditing,
  editorStopEditing,
  editorTakeAShot,
  editorKeyPressed,
  editorUndo,
  editorRedo,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

class EditorPanelUnconnected extends PureComponent<Props, void> {
  componentDidMount() {
    if (!this.panel) {
      return;
    }

    window.addEventListener('keydown', this.onKeyPress as any);

    const obj = document.getElementById('control-dialog');
    const { width } = this.panel.getBoundingClientRect();

    if (!this.panel || !obj) return;

    obj.style.width = String(width);
  }

  panel: HTMLDivElement | null = null;

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyPress as any);
  }

  onKeyPress = event => {
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') return;

    this.props.editorKeyPressed(event);
  };

  startPolyMode = () => this.props.editorChangeMode(MODES.POLY);
  startStickerMode = () => this.props.editorChangeMode(MODES.STICKERS_SELECT);
  startRouterMode = () => this.props.editorChangeMode(MODES.ROUTER);
  startTrashMode = () => this.props.editorChangeMode(MODES.TRASH);
  startSaveMode = () => {
    this.props.editorChangeMode(MODES.SAVE);
  };

  render() {
    const {
      mode,
      changed,
      editing,
      features: { routing },
      history: { records, position },
      route,
      stickers,
    } = this.props;

    const can_undo = records.length > 0 && position > 0;
    const can_redo = records.length && records.length - 1 > position;
    const can_clear = route.length > 0 || stickers.length > 0;

    return (
      <div>
        <div
          className={classnames('panel right', { active: editing })}
          ref={el => {
            this.panel = el;
          }}
        >
          <div
            className={classnames('secondary-bar secondary-bar__undo', {
              active: can_undo || can_redo || can_clear,
            })}
          >
            <button className={classnames({ inactive: !can_undo })} onClick={this.props.editorUndo}>
              <Tooltip>Отмена (z)</Tooltip>
              <Icon icon="icon-undo" size={24} />
            </button>

            <button
              className={classnames({
                inactive: !can_redo,
              })}
              onClick={this.props.editorRedo}
            >
              <Tooltip>Вернуть (x)</Tooltip>
              <Icon icon="icon-redo" size={24} />
            </button>

            <button
              className={classnames({
                inactive: !can_clear,
              })}
              onClick={this.startTrashMode}
            >
              <Tooltip>Очистить (c)</Tooltip>
              <Icon icon="icon-trash-4" size={24} />
            </button>
          </div>

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
