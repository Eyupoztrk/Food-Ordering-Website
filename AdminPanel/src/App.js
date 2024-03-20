import React, { useState } from "react";
import Login from "./components/Login";
import Main from "./components/Main";
import Person from "./components/Person";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div>
          <Main />
          <Person />
        </div>
      )}
    </div>
  );
};

export default App;
