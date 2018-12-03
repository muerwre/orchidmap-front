import React from 'react';
import { Icon } from '$components/panels/Icon';
import { MODES } from '$constants/modes';

type Props = {
  mode: String,
}

export class Cursor extends React.PureComponent<Props, void> {
  componentDidMount() {
    window.addEventListener('mousemove', this.moveCursor);
  }

  moveCursor = e => {
    if (!e.clientX || !e.clientY) return;

    const { clientX, clientY } = e;

    this.cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
  };

  render() {
    const { mode } = this.props;

    return (
      <div className="cursor-tooltip" ref={el => { this.cursor = el; }}>
        { mode === MODES.ROUTER && <Icon icon="icon-router" />}
        { mode === MODES.POLY && <Icon icon="icon-poly" />}
      </div>
    );
  }
};
