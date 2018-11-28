import React from 'react';
import { getTilePlacement } from '$utils/renderer';

export class Renderer extends React.Component {
  componentDidMount() {
    if (this.canvas) this.init();
  }

  init() {
    const ctx = this.canvas.getContext('2d');
    const geometry = getTilePlacement();

    this.fetchImages(ctx, geometry)
      .then(images => this.composeImages({ geometry, images, ctx }));

    // myimage = new Image();
    // myimage.onload = function() {
    //   ctx.drawImage(myimage, x, y);
    // }
    // myimage.src = 'http://myserver/nextimage.cgi';
  }

  fetchImages = (ctx, geometry) => {
    const {
      minX, maxX, minY, maxY, zoom
    } = geometry;

    const images = [];
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        images.push({ x, y, source: this.getImageSource({ x, y, zoom }) });
      }
    }

    return Promise.all(images.map(({ x, y, source }) => (
      this.imageFetcher(source).then(image => ({ x, y, image }))
    )));
  };

  imageFetcher = source => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);

    img.src = source;
  });

  getImageSource = ({ x, y, zoom }) => (`http://b.basemaps.cartocdn.com/light_all/${zoom}/${x}/${y}.png`);

  composeImages = ({ images, geometry, ctx }) => {
    const {
      minX, minY, maxY, shiftX, shiftY, size
    } = geometry;

    images.map(({ x, y, image }) => {
      const verticalShift = (maxY - minY) * size;

      const posX = ((x - minX) * size) + shiftX;
      const posY = ((y - minY) * size) - (verticalShift - shiftY);

      return ctx.drawImage(image, posX, posY, 256, 256);
    });
  };

  render() {
    return (
      <div className="renderer-shade" onClick={this.props.onClick}>
        <canvas width={window.innerWidth} height={window.innerWidth} ref={el => { this.canvas = el; }} />
      </div>
    );
  }
}

