import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";

import MainPage from "./Main";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import FindPassword from "./FindPassword";
import ChangePassword from "./ChangePassword";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
    }

    render(){
        return (
            <div className="App">
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />>
                    <Route path="/restore-pwd" element={<FindPassword />} />>
                    <Route path="/mainapp" element={<MainPage />} />>
                    <Route path="/change-pwd" element={<ChangePassword />} />
                </Routes>
            </div>
        )
    }
}

export default App;