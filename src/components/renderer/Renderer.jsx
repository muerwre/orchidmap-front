import React from 'react';

import { hideRenderer, cropAShot } from '$redux/user/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Croppr from 'croppr';
import 'croppr/dist/croppr.css';
import { Icon } from '$components/panels/Icon';
import { LOGOS } from '$constants/logos';

type Props = {
  data: String,
  logo: String,
  hideRenderer: Function,
  cropAShot: Function,
};

type State = {

};

class Component extends React.Component<Props, State> {
  onImageLoaded = () => {
    this.croppr = new Croppr(this.image, {
      onCropMove: this.moveLogo,
      onInitialize: this.onCropInit,
    });
  };

  componentWillUnmount() {
    this.croppr.destroy();
  }

  onCropInit = (crop) => {


    const { regionEl, box } = crop;
    const scale = ((box.x2 - box.x1) / window.innerWidth);

    console.log('CROP', crop, scale);

    this.logo = document.createElement('div');
    this.logo.className = 'renderer-logo';
    this.logo.style.transform = `scale(${scale})`;

    this.logoImg = document.createElement('img');
    this.logoImg.src = LOGOS[this.props.logo][1];

    this.logo.append(this.logoImg);
    regionEl.append(this.logo);
  };

  moveLogo = ({ x, y, width, height }) => {
    if (!this.logo) return;

    this.logo.style.color = 'blue';
  };

  croppr;

  getImage = () => {
    this.props.cropAShot(this.croppr.getValue());
  };

  render() {
    const { data } = this.props;
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
          style={{
            padding,
            paddingBottom,
          }}
        >
          <div
            style={{ width, height }}
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

        <div
          className="panel active"
          style={{
            zIndex: 1000,
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="control-bar control-bar-padded">
            <button>
              <Icon icon="icon-logo-3" />
            </button>
          </div>

          <div className="control-sep" />

          <div className="control-bar">
            <button
              className="highlighted cancel"
              onClick={this.props.hideRenderer}
            >
              <Icon icon="icon-cancel-1" />
            </button>

            <button
              className="success"
              onClick={this.getImage}
            >
              <span>СКАЧАТЬ</span>
              <Icon icon="icon-get-1" />
            </button>
          </div>
        </div>
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
