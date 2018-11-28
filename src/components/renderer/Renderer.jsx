import React from 'react';
import { getPolyPlacement, getTilePlacement } from '$utils/renderer';
import { COLORS, CONFIG } from '$config';

export class Renderer extends React.Component {
  componentDidMount() {
    if (this.canvas) this.init();
  }

  init() {
    const ctx = this.canvas.getContext('2d');
    const geometry = getTilePlacement();
    const points = getPolyPlacement();

    this.fetchImages(ctx, geometry)
      .then(images => this.composeImages({ geometry, images, ctx }))
      .then(() => this.composePoly({ geometry, points, ctx }))
      .then(() => this.canvas.toDataURL('image/jpeg'))
      .then(image => window.open().document.write(`<img src="${image}" />`))
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
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);

    img.src = source;
  });

  getImageSource = ({ x, y, zoom }) => (`http://b.basemaps.cartocdn.com/light_all/${zoom}/${x}/${y}.png`);

  composeImages = ({ images, geometry, ctx }) => {
    const {
      minX, minY, shiftX, shiftY, size
    } = geometry;

    images.map(({ x, y, image }) => {
      const posX = ((x - minX) * size) + shiftX;
      const posY = ((y - minY) * size) - shiftY;

      return ctx.drawImage(image, posX, posY, 256, 256);
    });

    return images;
  };

  composePoly = ({ points, geometry, ctx }) => {
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    ctx.strokeStyle = 'red';
    ctx.strokeLinecap = 'round';
    ctx.strokeLinejoin = 'round';
    ctx.lineWidth = CONFIG.STROKE_WIDTH;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);

      // gradient bounds
      if (points[i].x < minX) minX = points[i].x;
      if (points[i].x > maxX) maxX = points[i].x;
      if (points[i].y < minY) minY = points[i].y;
      if (points[i].y > maxY) maxY = points[i].y;
    }

    const gradient = ctx.createLinearGradient(minX, minY, minX, maxY);
    gradient.addColorStop(0, COLORS.PATH_COLOR[0]);
    gradient.addColorStop(1, COLORS.PATH_COLOR[1]);

    ctx.strokeStyle = gradient;
    ctx.stroke();
    ctx.closePath();

    return true;
  };

  render() {
    return (
      <div className="renderer-shade" onClick={this.props.onClick}>
        <canvas width={window.innerWidth} height={window.innerHeight} ref={el => { this.canvas = el; }} />
      </div>
    );
  }
}

