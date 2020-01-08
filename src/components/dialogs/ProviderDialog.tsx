import * as React from 'react';
import { PROVIDERS, replaceProviderUrl } from '$constants/providers';
import { Icon } from '$components/panels/Icon';
import classnames from 'classnames';
import * as MAP_ACTIONS from "$redux/map/actions";
import { IRootState } from "$redux/user";
import { selectMapProvider } from '$redux/map/selectors';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  provider: selectMapProvider(state),
});

const mapDispatchToProps = {
  mapSetProvider: MAP_ACTIONS.mapSetProvider,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const ProviderDialogUnconnected = ({ provider, mapSetProvider }: Props) => (
  <div className="control-dialog top right control-dialog-provider">
    <div className="helper provider-helper">
      {
        Object.keys(PROVIDERS).map(item => (
          <div
            className={classnames('provider-helper-thumb', { active: provider === item })}
            style={{
              backgroundImage: `url(${replaceProviderUrl(item, { x: 5980, y: 2589, zoom: 13 })})`,
            }}
            onMouseDown={() => mapSetProvider(item)}
            key={PROVIDERS[item].name}
          >
            {
              provider === item &&
                <div className="provider-helper-check">
                  <Icon icon="icon-check-1" />
                </div>
            }
          </div>
        ))
      }
    </div>
  </div>
);

const ProviderDialog = connect(mapStateToProps, mapDispatchToProps)(ProviderDialogUnconnected)

export { ProviderDialog }