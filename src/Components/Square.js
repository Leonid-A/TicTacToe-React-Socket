function Square(props) {
  return (
    <div className="item" onClick={props.onClick}>
      {props.value}
    </div>
  );
}

export default Square;
