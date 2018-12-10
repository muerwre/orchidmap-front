import React from 'react';

import { hideRenderer, cropAShot } from '$redux/user/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Croppr from 'croppr';
import 'croppr/dist/croppr.css';
import { Icon } from '$components/panels/Icon';
import { LOGOS } from '$constants/logos';
import { RendererPanel } from '$components/panels/RendererPanel';

type Props = {
  data: String,
  logo: String,
  hideRenderer: Function,
  cropAShot: Function,
};

type State = {
  opacity: Number,
};

class Component extends React.Component<Props, State> {
  state = {
    opacity: 0,
  };

  onImageLoaded = () => {
    this.croppr = new Croppr(this.image, {
      onInitialize: this.onCropInit,
    });

    this.setState({ opacity: 1 });
  };

  componentWillUnmount() {
    if (this.croppr) this.croppr.destroy();
  }

  onCropInit = (crop) => {
    const { regionEl, box } = crop;
    const scale = ((box.x2 - box.x1) / window.innerWidth);

    this.logo = document.createElement('div');
    this.logo.className = 'renderer-logo';
    this.logo.style.transform = `scale(${scale})`;

    this.logoImg = document.createElement('img');
    if (this.props.logo && LOGOS[this.props.logo][1]) this.logoImg.src = LOGOS[this.props.logo][1];

    this.logo.append(this.logoImg);
    regionEl.append(this.logo);
  };

  croppr;

  getImage = () => this.props.cropAShot(this.croppr.getValue());

  render() {
    const { data } = this.props;
    const { opacity } = this.state;
    const { innerWidth, innerHeight } = window;
    const padding = 30;
    const paddingBottom = 80;

    let width;
    let height;

    // if (innerWidth > innerHeight) {
    height = innerHeight - padding - paddingBottom;
    width = height * (innerWidth / innerHeight);
    // }

    return (
      <div>
        <div
          className="renderer-shade"
          style={{ padding, paddingBottom }}
        >
          <div
            style={{ width, height, opacity }}
          >
            <img
              src={data}
              alt=""
              id="rendererOutput"
              ref={el => { this.image = el; }}
              onLoad={this.onImageLoaded}
            />
          </div>
        </div>

        <RendererPanel
          onCancel={this.props.hideRenderer}
          onSubmit={this.getImage}
        />
      </div>
    );
  }
}


const mapStateToProps = state => ({ ...state.user.renderer, logo: state.user.logo });

const mapDispatchToProps = dispatch => bindActionCreators({
  hideRenderer,
  cropAShot,
}, dispatch);

export const Renderer = connect(mapStateToProps, mapDispatchToProps)(Component);
