import classes from "./Styles/HomeBlock.module.css";

function Home(props) {
  return (
    <div className={classes.home}>
      <h3>{`Home of ${props.id} size`} </h3>
      <div className={classes.homeButton} onClick={props.click} id={props.id}>
        Button
      </div>
    </div>
  );
}

export default Home;
