import classes from "./Styles/HomeBlock.module.css";

function Room(props) {
  return (
    <div className={classes.room} onClick={props.click}>
      <p>Room ID {props.id}</p>
      <p>
        Player1---: {props.player1 ? props.player1.userName : props.player1}
      </p>
      <p>
        Player2----: {props.player2 ? props.player2.userName : props.player2}
      </p>
      <p>{props.status}</p>
    </div>
  );
}

export default Room;
