import React, { FC, Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import { IState } from '~/redux/store';
import { selectEditorNominatim } from '~/redux/editor/selectors';
import { DialogLoader } from './DialogLoader';
import { NominatimListItem } from '~/components/nominatim/NominatimListItem';
import { MainMap } from '~/constants/map';
import { Scroll } from '../Scroll';

const mapStateToProps = (state: IState) => ({
  nominatim: selectEditorNominatim(state),
});

type Props = ReturnType<typeof mapStateToProps> & {};

const NominatimDialogUnconnected: FC<Props> = ({ nominatim: { loading, list } }) => {
  const onItemClick = useCallback(
    (index: number) => {
      if (!list[index]) return;

      MainMap.setView(list[index].latlng, 17);
    },
    [MainMap, list]
  );

  return (
    <Fragment>
      <Scroll>
        <div className="dialog-flex-scroll">
          <div style={{ flex: 1 }} />

          <div className="dialog-content nominatim-dialog-content">
            {loading && <DialogLoader />}
            {list.map((item, i) => (
              <NominatimListItem item={item} key={item.id} />
            ))}
          </div>
        </div>
      </Scroll>
    </Fragment>
  );
};

const NominatimDialog = connect(mapStateToProps)(NominatimDialogUnconnected);

export { NominatimDialog };
