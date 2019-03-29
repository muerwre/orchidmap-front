import * as React from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

import classnames from 'classnames';
import { getStyle } from "$utils/dom";
import { nearestInt } from "$utils/geom";
import { IRootState } from "$redux/user/reducer";
import { parseDesc } from "$utils/format";

interface ITitleDialogProps {
  editing: IRootState['editing'],
  title?: IRootState['title'],
  description?: IRootState['description'],
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
    this.setMaxHeight();
  }

  componentDidUpdate() {
    this.setMaxHeight();
  }

  setMaxHeight = (): number => {
    if (!this.ref_sizer || !this.ref_title || !this.ref_text) return 0;

    const { height: sizer_height } = this.ref_sizer.getBoundingClientRect();
    const { height: title_height } = this.ref_title.getBoundingClientRect();
    const { height: text_height } = this.ref_text.getBoundingClientRect();

    if (text_height === 0) {
      this.setState({ height: 0, height_raised: 0 });
      return;
    }

    const title_margin = parseInt(getStyle(this.ref_title, 'margin-bottom'), 10) || 0;
    const text_margins = (parseInt(getStyle(this.ref_text, 'margin-top'), 10) || 0) +
      parseInt(getStyle(this.ref_text, 'margin-bottom'), 10) || 0;;
    const text_line = parseInt(getStyle(this.ref_text, 'line-height'), 10) || 0;

    const container_height = sizer_height - title_height - title_margin - text_margins;

    const min_height = (this.props.minLines || 5) * text_line;
    const max_height = (this.props.maxLines || 20) * text_line;

    const height = nearestInt(Math.min(container_height, Math.min(text_height, min_height)), text_line) + text_margins;
    const height_raised = nearestInt(Math.min(container_height, Math.min(text_height, max_height)), text_line) + text_margins;

    this.setState({ height, height_raised });
  };

  render() {
    const { editing, title, description } = this.props;
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
              className={classnames("title-dialog-pane title-dialog-text", { has_shade: height_raised > height })}
              style={{
                height: (raised ? height_raised : height),
                marginBottom: height === 0 ? 0 : 15,
              }}
              ref={el => { this.ref_overflow = el; }}
            >
              <div
                ref={el => { this.ref_text = el; }}
              >
                {
                  parseDesc(description)
                }
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

const mapStateToProps = ({ user: { editing, title, description } }) => ({ editing, title, description });
const mapDispatchToProps = dispatch => bindActionCreators({ }, dispatch);

export const TitleDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
