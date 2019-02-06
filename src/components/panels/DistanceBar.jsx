// flow
import React from 'react';
import { toHours } from '$utils/format';
import { Icon } from '$components/panels/Icon';
import { connect } from 'react-redux';

type Props = {
  distance: number,
  estimated: number,
};

const Component = ({ distance, estimated }: Props) => (
  <div className="status-bar padded desktop-only">
    {distance} км&nbsp;
    <Icon icon="icon-cycle" size={32} />
    {
      <span>{toHours(estimated)}</span>
    }
  </div>
);

function mapStateToProps(state) {
  const {
    user: { distance, estimated },
  } = state;

  return { distance, estimated };
}

const mapDispatchToProps = () => ({ });

export const DistanceBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
