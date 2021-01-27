import { useRef, useState } from "react";
import classes from "./Styles/Login.module.css";

function Login(props) {
  const localStorage = window.localStorage;
  const [valid, setValid] = useState(true);

  const handleSubmit = () => {
    const value = inputEl.current.value;
    if (value === "") {
      setValid(false);
    } else {
      setValid(true);
      props.onChange(value);
      localStorage.setItem("userName", value);
    }
  };
  const inputEl = useRef(null);

  return (
    <div className={classes.login}>
      <input type="text" ref={inputEl}></input>
      <div className={classes.button} onClick={handleSubmit}>
        Submit
      </div>
      {valid ? null : <p> Please Enter Your Name</p>}
    </div>
  );
}

export default Login;