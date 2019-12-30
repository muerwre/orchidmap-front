import * as React from "react";
import { LOGOS } from "$constants/logos";
import { connect } from "react-redux";
import { IRootState } from "$redux/user";

interface Props extends IRootState {}

const Component = ({ logo }: Props) => (
  <div
    className="logo-preview"
    style={{
      backgroundImage: logo
        ? `url(${LOGOS && LOGOS[logo] && LOGOS[logo][1]})`
        : "none"
    }}
  />
);

const mapStateToProps = ({ user: { logo } }) => ({ logo });

export const LogoPreview = connect(mapStateToProps)(Component);
