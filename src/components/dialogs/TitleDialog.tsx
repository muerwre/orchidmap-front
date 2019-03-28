import * as React from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

import classnames from 'classnames';
import { getStyle } from "$utils/dom";
import { nearestInt } from "$utils/geom";

interface ITitleDialogProps {
  editing: boolean,
  title?: string,
  minLines?: number,
  maxLines?: number,
}

interface ITitleDialogState {
  raised: boolean;
  height: number;
  height_raised: number;
}

export class Component extends React.PureComponent<ITitleDialogProps, ITitleDialogState> {
  state = {
    raised: false,
    height: 0,
    height_raised: 0,
  };

  onHover = () => this.setState({ raised: true });
  onLeave = () => this.setState({ raised: false });

  componentDidMount() {
    this.getMaxHeight();
  }

  getMaxHeight = (): number => {
    if (!this.ref_sizer || !this.ref_title || !this.ref_text) return 0;

    const { height: sizer_height } = this.ref_sizer.getBoundingClientRect();
    const { height: title_height } = this.ref_title.getBoundingClientRect();
    const { height: text_height } = this.ref_text.getBoundingClientRect();

    const title_margin = parseInt(getStyle(this.ref_title, 'margin-bottom'), 10) || 0;
    const text_margins = (parseInt(getStyle(this.ref_text, 'margin-top'), 10) || 0) +
      parseInt(getStyle(this.ref_text, 'margin-bottom'), 10) || 0;;
    const text_line = parseInt(getStyle(this.ref_text, 'line-height'), 10) || 0;

    const container_height = sizer_height - title_height - title_margin - text_margins;

    console.log(this.ref_text.getBoundingClientRect());

    const min_height = (this.props.minLines || 3) * text_line;
    const max_height = (this.props.maxLines || 20) * text_line;

    const height = nearestInt(Math.min(container_height, Math.min(text_height, min_height)), text_line) + text_margins;
    const height_raised = nearestInt(Math.min(container_height, Math.min(text_height, max_height)), text_line) + text_margins;

    console.log({ height, height_raised });
    this.setState({ height, height_raised });
  };

  render() {
    const { editing, title } = this.props;
    const { raised, height, height_raised } = this.state;

    return (
      <div className="title-dialog-wrapper">
        <div className="title-dialog-sizer" ref={el => { this.ref_sizer = el; }}>
          <div
            className={classnames('title-dialog', { active: title && !editing })}
            onMouseOver={this.onHover}
            onMouseOut={this.onLeave}
          >
            <div
              className="title-dialog-pane title-dialog-name"
              ref={el => { this.ref_title = el; }}
            >
              <h2>{title}</h2>
            </div>
            <div
              className="title-dialog-pane title-dialog-text"
              style={{ height: raised ? height_raised : height }}
              ref={el => { this.ref_overflow = el; }}
            >
              <div
                ref={el => { this.ref_text = el; }}
              >
                Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  ref_sizer;
  ref_title;
  ref_text;
  ref_overflow;
}

const mapStateToProps = ({ user: { editing, title } }) => ({ editing, title });
const mapDispatchToProps = dispatch => bindActionCreators({ }, dispatch);

export const TitleDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
