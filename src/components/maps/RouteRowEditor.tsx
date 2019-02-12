// @flow
import * as React from 'react';
import { Icon } from '$components/panels/Icon';
import { Switch } from '$components/Switch';

interface Props {
  title: string;
  is_editing: boolean;
  distance: number;
  _id: string;
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

  stopEditing = () => console.log();
  setPublic = () => this.setState({ is_public: !this.state.is_public });
  setTitle = ({ target: { value } }: { target: { value: string } }) => this.setState({ title: value });

  render() {
    const {
      state: { title, is_public },
      props: { distance, _id }
    } = this;

    return (
      <div
        className="route-row"
      >
        <div className="route-title">
          <input
            type="text"
            value={title}
            onChange={this.setTitle}
            placeholder="Введите название"
            autoFocus
          />
        </div>
        <div className="route-description">
          <span>
            <Icon icon="icon-link-1" />
            {_id}
          </span>
          <span>
            <Icon icon="icon-cycle-1" />
            {(distance && `${distance} km`) || '0 km'}
          </span>
        </div>
        <div className="route-row-editor">
          <div className="route-row-buttons">
            <div className="flex_1" onClick={this.setPublic}>
              <Switch
                active={is_public}
              />
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
    );
  }
}
