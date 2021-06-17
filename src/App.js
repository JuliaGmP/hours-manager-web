import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import Layout from "./layouts/Layout";

import Login from "./components/login/containers/LoginContainer";
import Home from "./components/Home/containers/HomeContainer";
import Clients from "./components/Clients/Clients/containers/ClientsContainer";
import Projects from "./components/Projects/Projects/containers/ProjectsContainer";
import Users from "./components/Users/Users/containers/UsersContainer";
import UserProfile from "./components/UserProfile/containers/UserProfileContainer";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {    
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Layout>
                            <AuthMiddleware>
                                <Route path="/" exact={true}>
                                    <Redirect to="/home" />
                                </Route>
                                <Route path="/home">
                                    <Home />
                                </Route>
                                <Route path="/clientes">
                                    <Clients />
                                </Route>
                                <Route path="/usuarios">
                                    <Users />
                                </Route>
                                <Route path="/proyectos">
                                    <Projects />
                                </Route>
                                <Route path="/user-profile">
                                    <UserProfile />
                                </Route>
                            </AuthMiddleware>
                        </Layout>
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;

