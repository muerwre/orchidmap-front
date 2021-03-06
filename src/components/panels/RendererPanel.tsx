import React from 'react';
import { Icon } from '~/components/panels/Icon';

type Props = {
  onCancel: () => void,
  onSubmit: () => void,
};

export const RendererPanel = ({ onCancel, onSubmit }: Props) => (
  <div
    className="panel active center"
    style={{ zIndex: 1000 }}
  >
    <div className="control-sep" />

    <div className="control-bar">
      <button
        className="highlighted cancel"
        onClick={onCancel}
      >
        <Icon icon="icon-cancel-1" />
        <span>Отмена</span>
      </button>

      <button
        className="success"
        onClick={onSubmit}
      >
        <span>СКАЧАТЬ</span>
        <Icon icon="icon-get-1" />
      </button>
    </div>
  </div>
);
