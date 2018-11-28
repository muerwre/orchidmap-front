import React from 'react';
import { getPolyPlacement, getTilePlacement, composeImages, composePoly, fetchImages } from '$utils/renderer';

export class Renderer extends React.Component {
  componentDidMount() {
    if (this.canvas) this.init();
  }

  init() {
    const ctx = this.canvas.getContext('2d');
    const geometry = getTilePlacement();
    const points = getPolyPlacement();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    fetchImages(ctx, geometry)
      .then(images => composeImages({ geometry, images, ctx }))
      .then(() => composePoly({ points, ctx }))
      .then(() => this.canvas.toDataURL('image/jpeg'));
    // .then(image => window.open().document.write(`<img src="${image}" />`))
  }

  render() {
    return (
      <div className="renderer-shade" onClick={this.props.onClick}>
        <canvas width={window.innerWidth} height={window.innerHeight} ref={el => { this.canvas = el; }} />
      </div>
    );
  }
}

