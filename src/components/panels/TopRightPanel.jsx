// flow
import React from 'react';
import { Icon } from '$components/panels/Icon';
import { PROVIDERS } from '$constants/providers';
import { LOGOS } from '$constants/logos';
import { setMode } from '$redux/user/actions';
import { connect } from 'react-redux';
import { MODES } from '$constants/modes';

type Props = {
  provider: string,
  logo: string,
  markers_shown: boolean,
  editing: boolean,
  startProviderMode: Function,
  startLogoMode: Function,
  clearMode: Function,
};

const Component = ({
  provider, logo, startProviderMode, startLogoMode, clearMode, editing, markers_shown,
}: Props) => (
  <div className="status-panel top right">
    {
      editing && !markers_shown &&
      <div className="status-bar pointer top-control padded warning icon-only">
        <Icon icon="icon-eye-1" size={24} />
        <div className="status-bar-tip">Приблизьте, чтобы редактировать кривую</div>
      </div>
    }
    <div className="status-bar pointer top-control padded" onFocus={startProviderMode} onBlur={clearMode} tabIndex={-1}>
      <Icon icon="icon-map-1" size={24} />
      <div className="status-bar-sep" />
      <span>{(provider && PROVIDERS[provider] && PROVIDERS[provider].name) || '...'}</span>
    </div>

    <div className="status-bar pointer top-control padded" onFocus={startLogoMode} onBlur={clearMode} tabIndex={-1}>
      <Icon icon="icon-logo-3" size={24} />
      <div className="status-bar-sep" />
      <span>{(logo && LOGOS[logo] && LOGOS[logo][0]) || '...'}</span>
    </div>
  </div>
);

function mapStateToProps(state) {
  const {
    user: {
      provider, logo, markers_shown, editing
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
