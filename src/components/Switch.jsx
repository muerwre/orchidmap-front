// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  active: Boolean,
  onPress: Function,
}
export const Switch = ({ active, onPress = () => {} }: Props) => (
  <div
    className={classnames('switch', { active })}
    onMouseDown={onPress}
  />
);
