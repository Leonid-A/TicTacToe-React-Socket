import HomeBlock from "./Components/HomeBlock.js";
import Board from "./Components/Board.js";
import Login from "./Components/Login.js";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";

import { appSocket, socketEvents } from "./constants";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    appSocket.on(socketEvents.connected, (data) => {});

    const currentUser = localStorage.getItem("userName");
    setIsLoggedIn(currentUser ? true : false);

    // CLEAN UP THE EFFECT
    return () => appSocket.disconnect();
    //
  }, []);

  const changeStateData = (name) => {
    // use name
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/home">
            {!isLoggedIn ? (
              <Redirect to="/login" />
            ) : (
              <Route exact component={HomeBlock} />
            )}
          </Route>
          <Route path="/login">
            {isLoggedIn ? (
              <Redirect to="/home" />
            ) : (
              <Route>
                <Login onChange={changeStateData} />
              </Route>
            )}
          </Route>
          <Route exact path="/">
            {isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>

          <Route exact path="/room/:size/:id">
            {!isLoggedIn ? (
              <Redirect to="/login" />
            ) : (
              <Route component={Board} />
            )}
          </Route>

          <Route path="*" render={() => <h1>page not found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;