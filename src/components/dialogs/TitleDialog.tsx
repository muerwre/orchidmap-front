import * as React from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

import classnames from 'classnames';

interface ITitleDialogProps {
  editing: boolean,
  title?: string,
}

interface ITitleDialogState {
  raised: boolean;
}

export class Component extends React.PureComponent<ITitleDialogProps, ITitleDialogState> {
  state = {
    raised: false,
  };

  onHover = () => this.setState({ raised: true });
  onLeave = () => this.setState({ raised: false });

  render() {
    const { editing, title } = this.props;

    return (
      <div className="title-dialog-wrapper">
        <div className="title-dialog-sizer" ref={el => { this.sizer = el; }}>
          <div className={classnames('title-dialog', { active: title && !editing })}>
            <div className="title-dialog-pane title-dialog-name">
              <h2>{title}</h2>
            </div>
            <div className="title-dialog-pane title-dialog-text">
              Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по
            </div>
          </div>
        </div>
      </div>
    )
  }

  text;
  sizer;
}

const mapStateToProps = ({ user: { editing, title } }) => ({ editing, title });
const mapDispatchToProps = dispatch => bindActionCreators({ }, dispatch);

export const TitleDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
