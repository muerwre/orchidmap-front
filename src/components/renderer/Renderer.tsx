import React from 'react';

import { connect } from 'react-redux';
import Croppr from 'croppr';
import 'croppr/dist/croppr.css';
import { LOGOS } from '~/constants/logos';
import { RendererPanel } from '~/components/panels/RendererPanel';
import { selectEditor } from '~/redux/editor/selectors';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { selectMap } from '~/redux/map/selectors';

const mapStateToProps = state => ({
  editor: selectEditor(state),
  map: selectMap(state),
});

const mapDispatchToProps = {
  editorHideRenderer: EDITOR_ACTIONS.editorHideRenderer,
  editorCropAShot: EDITOR_ACTIONS.editorCropAShot,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

type State = {
  opacity: number,
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
    if (this.props.map.logo && LOGOS[this.props.map.logo][1]) this.logoImg.src = LOGOS[this.props.map.logo][1];

    this.logo.append(this.logoImg);
    regionEl.append(this.logo);
  };

  croppr: Croppr;
  logo: HTMLDivElement;
  image: HTMLImageElement;
  logoImg: HTMLImageElement;

  getImage = () => this.props.editorCropAShot(this.croppr.getValue());

  render() {
    const { data } = this.props.editor.renderer;
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
          onCancel={this.props.editorHideRenderer}
          onSubmit={this.getImage}
        />
      </div>
    );
  }
}

export const Renderer = connect(mapStateToProps, mapDispatchToProps)(Component);
