import React from 'react';
import { LOGOS } from '$constants/logos';
import { connect } from 'react-redux';
import { IRootState } from '$redux/user';
import { selectMapLogo } from '$redux/map/selectors';

const mapStateToProps = state => ({ logo: selectMapLogo(state) });
type Props = ReturnType<typeof mapStateToProps>;

const LogoPreviewUnconnected = React.memo(({ logo }: Props) => (
  <div
    className="logo-preview"
    style={{
      backgroundImage: logo ? `url(${LOGOS && LOGOS[logo] && LOGOS[logo][1]})` : 'none',
    }}
  />
));

const LogoPreview = connect(mapStateToProps)(LogoPreviewUnconnected);

export { LogoPreview };
