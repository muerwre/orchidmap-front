import React from 'react';
import { LOGOS } from '$constants/logos';
import { connect } from 'react-redux';

type Props = {
  logo: string
};

const Component = ({ logo }: Props) => (
  <div
    className="logo-preview"
    style={{
      backgroundImage: logo
        ? `url(${LOGOS[logo][1]})`
        : 'none'
    }}
  />
);

function mapStateToProps(state) {
  const { user: { logo } } = state;
  return { logo };
}

export const LogoPreview = connect(mapStateToProps)(Component);
