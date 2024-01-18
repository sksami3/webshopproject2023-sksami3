import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/user";

class App extends Component {
  render() {
    return (
      <UserProvider>
        <BrowserRouter>
          <div className="App">
            <Main />
          </div>
        </BrowserRouter>
      </UserProvider>
    );
  }
}

export default App;
