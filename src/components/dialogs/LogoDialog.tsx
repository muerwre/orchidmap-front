import React from 'react';
import { LOGOS } from '$constants/logos';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import * as MAP_ACTIONS from "$redux/map/actions"
import { selectMapLogo } from '$redux/map/selectors';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  logo: selectMapLogo(state),
});

const mapDispatchToProps = {
  mapSetLogo: MAP_ACTIONS.mapSetLogo,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const LogoDialogUnconnected = ({ logo, mapSetLogo }: Props) => (
  <div className="control-dialog top">
    <div className="helper logo-helper">
      <div className="helper-back">
        <Icon icon="icon-logo" size={200} />
      </div>
      {
        Object.keys(LOGOS).map(item => (
          <div
            className={classnames('helper-menu-item', { active: (item === logo) })}
            onMouseDown={() => mapSetLogo(item)}
            key={item}
          >
            {LOGOS[item][0]}
          </div>
        ))
      }
    </div>
  </div>
);

const LogoDialog = connect(mapStateToProps, mapDispatchToProps)(LogoDialogUnconnected);

export { LogoDialog };