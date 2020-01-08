// flow
import React from 'react';
import { Icon } from '$components/panels/Icon';
import { PROVIDERS } from '$constants/providers';
import { LOGOS } from '$constants/logos';
import { setMode } from '$redux/user/actions';
import { connect } from 'react-redux';
import { MODES } from '$constants/modes';
import { IRootState } from "$redux/user";

import { Tooltip } from "$components/panels/Tooltip";

interface Props extends IRootState {
  startProviderMode: () => void,
  startLogoMode: () => void,
  clearMode: () => void,
}

const Component = ({
  provider, logo, startProviderMode, startLogoMode, clearMode, editing, markers_shown,
}: Props) => (
  <div className="status-panel top right">
    {
      editing && !markers_shown &&
      <div className="status-bar pointer top-control padded warning icon-only tooltip-container">
        <Icon icon="icon-eye-1" size={24} />
        <Tooltip position="top">Приблизьте, чтобы редактировать кривую</Tooltip>
      </div>
    }
    <div className="status-bar pointer top-control padded tooltip-container" onFocus={startProviderMode} onBlur={clearMode} tabIndex={-1}>
      <Tooltip position="top">Стиль карты</Tooltip>
      <Icon icon="icon-map-1" size={24} />
      <div className="status-bar-sep" />
      <span>{(provider && PROVIDERS[provider] && PROVIDERS[provider].name) || '...'}</span>
    </div>

    <div className="status-bar pointer top-control padded tooltip-container" onFocus={startLogoMode} onBlur={clearMode} tabIndex={-1}>
      <Tooltip position="top">Логотип</Tooltip>
      <Icon icon="icon-logo-3" size={24} />
      <div className="status-bar-sep" />
      <span>{(logo && LOGOS[logo] && LOGOS[logo][0]) || '...'}</span>
    </div>
  </div>
);

function mapStateToProps(state) {
  const {
    map: {
      provider,
      logo,
    },
    user: {
      markers_shown, editing
    },
  } = state;

  return {
    provider, logo, markers_shown, editing
  };
}

const mapDispatchToProps = dispatch => ({
  startProviderMode: () => dispatch(setMode(MODES.PROVIDER)),
  startLogoMode: () => dispatch(setMode(MODES.LOGO)),
  clearMode: () => dispatch(setMode(MODES.NONE)),
});

export const TopRightPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
