import * as React from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';

interface ITitleDialogProps {
  editing: boolean,
  title?: string,
}

export const Component: React.FunctionComponent<ITitleDialogProps> = ({ editing, title }) => (
  !editing && title &&
    <div className="title-dialog">
      <div className="title-dialog-pane title-dialog-name">
        <h2>{title}</h2>
      </div>
    </div>
);

const mapStateToProps = ({ user: { editing, title } }) => ({ editing, title });
const mapDispatchToProps = dispatch => bindActionCreators({ }, dispatch);

export const TitleDialog = connect(mapStateToProps, mapDispatchToProps)(Component);
