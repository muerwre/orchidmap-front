// flow
import * as React from 'react';
import { toHours } from '$utils/format';
import { Icon } from '$components/panels/Icon';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import { bindActionCreators } from 'redux';
import { setSpeed } from '$redux/user/actions';
import { IRootState } from "$redux/user/reducer";

interface Props extends IRootState {
  setSpeed: typeof setSpeed,
}

interface State {
  dialogOpened: boolean,
}

class Component extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpened: false,
    };
  }

  step: number = 5;
  min: number = 5;
  max: number = 30;

  marks: { [x: number]: string } = [...Array((Math.floor(this.max - this.min) / this.step) + 1)].reduce((obj, el, index) => ({
    ...obj,
    [this.min + (index * this.step)]: String(this.min + (index * this.step)),
  }), { });

  toggleDialog = () => this.setState({ dialogOpened: !this.state.dialogOpened });

  render() {
    const {
      props: { distance, estimated, speed },
      state: { dialogOpened },
      min, max, step, marks,
    } = this;


    return (
      <React.Fragment>
        <div className="status-bar padded desktop-only pointer" onClick={this.toggleDialog}>
          {distance} км&nbsp;
          <Icon icon="icon-cycle" size={32} />
          {
            <span>{toHours(estimated)}</span>
          }
        </div>
        {
          dialogOpened &&
          <div className="control-dialog top left" style={{ left: 0, top: 42 }}>
            <div className="helper speed-helper">
              <Slider
                min={min}
                max={max}
                step={step}
                onChange={this.props.setSpeed}
                defaultValue={15}
                value={speed}
                marks={marks}
              />
            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: { distance, estimated, speed },
  } = state;

  return { distance, estimated, speed };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setSpeed,
}, dispatch);

export const DistanceBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);