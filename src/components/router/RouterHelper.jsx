import React from 'react';

const noPoints = ({ cancelDrawing }) => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Укажите на карте первую точку маршрута</div>
      <div className="small gray">Путь прокладывается по улицам, тротуарам и тропинкам</div>
    </div>
    <div className="router-helper__buttons">
      <div className="button router-helper__button" onClick={cancelDrawing}>
        Отмена
      </div>
    </div>
  </div>
);

const firstPoint = ({ cancelDrawing }) => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Укажите на карте конечную точку маршрута</div>
      <div className="small gray"> Вы сможете добавить уточняющие точки</div>
    </div>
    <div className="router-helper__buttons">
      <div className="button router-helper__button" onClick={cancelDrawing}>
        Отмена
      </div>
    </div>
  </div>
);

const draggablePoints = ({ cancelDrawing, submitDrawing }) => (
  <div className="router-helper">
    <div className="router-helper__text">
      <div className="big white">Продолжите маршрут, щелкая по карте</div>
      <div className="small gray">Потяните линию, чтобы указать промежуточные точки</div>
    </div>
    <div className="router-helper__buttons button-group">
      <div className="button button_red router-helper__button" onClick={cancelDrawing}>
        Отмена
      </div>
      <div className="button primary router-helper__button" onClick={submitDrawing}>
        Применить
      </div>
    </div>
  </div>
);

export class RouterHelper extends React.Component {
  cancelDrawing = () => {
    this.props.editor.router.cancelDrawing();
  };

  submitDrawing = () => {
    this.props.editor.router.submitDrawing();
  };

  render() {
    const { routerPoints, editor } = this.props;
    const { cancelDrawing, submitDrawing } = this;
    return (
      <div>
        {!routerPoints && noPoints({ cancelDrawing })}
        {routerPoints === 1 && firstPoint({ cancelDrawing })}
        {routerPoints >= 2 && draggablePoints({ cancelDrawing, submitDrawing })}
      </div>
    );
  }
}
