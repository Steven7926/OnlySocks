import React from 'react';
import LoginPage from './pages/LoginPage';
import MainUIPage from './pages/MainUIPage';
import { NativeRouter, Route, Switch, Redirect, useHistory } from "react-router-native";

function App() {
    return (
        <NativeRouter >
            <Switch>
                <Route exact path="/" >
                    <LoginPage />
                </Route>
                <Route exact path="/onlysocks" >
                    <MainUIPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        </NativeRouter>
    );
}

export default App;