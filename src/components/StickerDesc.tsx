import React from 'react';
import classnames from 'classnames';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
}

type State = {
  text: String;
}

class StickerDesc extends React.PureComponent<Props, State> {
  state = {
    text: this.props.value,
  };

  setText = e => {
    this.props.onChange(e.target.value);
  };

  blockMouse = e => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.input) {
      return
    }

    this.input.focus();
  };

  input: HTMLTextAreaElement | null = null;

  render() {
    const { value: text } = this.props;

    return (
      <div
        className={classnames('sticker-desc', { is_empty: !text.trim() })}
        onMouseDownCapture={this.blockMouse}
        onMouseUpCapture={this.blockMouse}
        onDragStartCapture={this.blockMouse}
        onTouchStartCapture={this.blockMouse}
      >
        <div className="sticker-desc-sizer">
          <span
            dangerouslySetInnerHTML={{
              __html: (text.replace(/\n$/, '\n&nbsp;').replace(/\n/g, '<br />') || '&nbsp;')
            }}
          />
          <textarea
            onChange={this.setText}
            value={text}
            onMouseDown={this.blockMouse}
            onDragStart={this.blockMouse}
            ref={el => { this.input = el; }}
            onBlur={this.props.onBlur}
          />
        </div>
      </div>
    )
  }
}

export { StickerDesc };
