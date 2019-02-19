import * as React from 'react';
import classnames from 'classnames';

export const Tooltip = ({ children, position = 'bottom' }: { children: string, position?: string }) => (
  <div className={classnames('panel-tooltip', { top: position === 'top' })}>
    {children}
  </div>
);
