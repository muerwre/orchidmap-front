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
  startProviderMode: Function,
  startLogoMode: Function,
};

const Component = ({
  provider, logo, startProviderMode, startLogoMode
}: Props) => (
  <div className="status-panel top right">
    <div className="status-bar pointer top-control padded" onClick={startProviderMode}>
      <Icon icon="icon-map-1" size={24} />
      <div className="status-bar-sep" />
      <span>{(provider && PROVIDERS[provider] && PROVIDERS[provider].name) || '...'}</span>
    </div>

    <div className="status-bar pointer top-control padded" onClick={startLogoMode}>
      <Icon icon="icon-logo-3" size={24} />
      <div className="status-bar-sep" />
      <span>{(logo && LOGOS[logo] && LOGOS[logo][0]) || '...'}</span>
    </div>
  </div>
);

function mapStateToProps(state) {
  const {
    user: { provider, logo },
  } = state;

  return { provider, logo };
}

const mapDispatchToProps = dispatch => ({
  startProviderMode: () => dispatch(setMode(MODES.PROVIDER)),
  startLogoMode: () => dispatch(setMode(MODES.LOGO)),
});

export const TopRightPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
