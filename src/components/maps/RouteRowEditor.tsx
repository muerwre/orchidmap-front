// @flow
import React from 'react';
import { Icon } from '~/components/panels/Icon';
import { Switch } from '~/components/Switch';
import { MapListDialog } from "~/components/dialogs/MapListDialog";

interface Props {
  title: string;
  address: string;
  is_public: boolean,
  modifyRoute: typeof MapListDialog.modifyRoute,
}

interface State {
  title: string,
  is_public: boolean,
}

export class RouteRowEditor extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      is_public: props.is_public,
    };
  }

  stopEditing = () => {
    const {
      state: { title, is_public },
      props: { address }
    } = this;

    this.props.modifyRoute({ address, title, is_public })
  };

  setPublic = () => this.setState({ is_public: !this.state.is_public });
  setTitle = ({ target: { value } }: { target: { value: string } }) => this.setState({ title: value });

  render() {
    const {
      state: { title, is_public },
    } = this;

    return (
      <div className="route-row-edit">
        <div className="route-row">
          <div className="route-title">
            <input
              type="text"
              value={title}
              onChange={this.setTitle}
              placeholder="Введите название"
              autoFocus
            />
          </div>
          <div className="route-row-editor">
            <div className="route-row-buttons">
              <div className="flex_1" onClick={this.setPublic}>
                <Switch active={is_public} />
                {
                  is_public
                    ? ' В каталоге карт'
                    : ' Только по ссылке'
                }
              </div>
              <div className="button primary" onClick={this.stopEditing}>
                OK
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
