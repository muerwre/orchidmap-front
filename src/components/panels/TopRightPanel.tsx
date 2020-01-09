import React, { useCallback } from 'react';
import { Icon } from '~/components/panels/Icon';
import { PROVIDERS } from '~/constants/providers';
import { LOGOS } from '~/constants/logos';
import * as EDITOR_ACTIONS from '~/redux/editor/actions';
import { connect } from 'react-redux';
import { MODES } from '~/constants/modes';

import { Tooltip } from '~/components/panels/Tooltip';
import { selectMap } from '~/redux/map/selectors';
import { selectEditor } from '~/redux/editor/selectors';

const mapStateToProps = state => ({
  map: selectMap(state),
  editor: selectEditor(state),
});

const mapDispatchToProps = {
  editorSetMode: EDITOR_ACTIONS.editorSetMode,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {};

const TopRightPanelUnconnected = ({
  map: { provider, logo },
  editor: { markers_shown, editing },
  editorSetMode,
}: Props) => {
  const startProviderMode = useCallback(() => editorSetMode(MODES.PROVIDER), [editorSetMode]);
  const startLogoMode = useCallback(() => editorSetMode(MODES.LOGO), [editorSetMode]);
  const clearMode = useCallback(() => editorSetMode(MODES.NONE), [editorSetMode]);

  return (
    <div className="status-panel top right">
      {editing && !markers_shown && (
        <div className="status-bar pointer top-control padded warning icon-only tooltip-container">
          <Icon icon="icon-eye-1" size={24} />
          <Tooltip position="top">Приблизьте, чтобы редактировать кривую</Tooltip>
        </div>
      )}
      <div
        className="status-bar pointer top-control padded tooltip-container"
        onFocus={startProviderMode}
        onBlur={clearMode}
        tabIndex={-1}
      >
        <Tooltip position="top">Стиль карты</Tooltip>
        <Icon icon="icon-map-1" size={24} />
        <div className="status-bar-sep" />
        <span>{(provider && PROVIDERS[provider] && PROVIDERS[provider].name) || '...'}</span>
      </div>

      <div
        className="status-bar pointer top-control padded tooltip-container"
        onFocus={startLogoMode}
        onBlur={clearMode}
        tabIndex={-1}
      >
        <Tooltip position="top">Логотип</Tooltip>
        <Icon icon="icon-logo-3" size={24} />
        <div className="status-bar-sep" />
        <span>{(logo && LOGOS[logo] && LOGOS[logo][0]) || '...'}</span>
      </div>
    </div>
  );
};

const TopRightPanel = connect(mapStateToProps, mapDispatchToProps)(TopRightPanelUnconnected);

export { TopRightPanel };
