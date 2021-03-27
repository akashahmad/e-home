import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css'
import Main from "./Components/Main";
import MyFooter from "./Components/MyFooter";
import 'react-multi-carousel/lib/styles.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Main />
                <MyFooter />
            </div>
        </Router>
    );
};

export default App;
