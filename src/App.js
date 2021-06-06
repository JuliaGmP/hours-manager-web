import React from "react";

import Login from "./components/login/containers/LoginContainer";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function App() {    
    return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/">
                            <Redirect to="/login" />
                        </Route>       
                    </Switch>
                </div>
            </Router>
    );
}

export default App;


