import React from "react"
import "./App.css"
import PrivateRoute from './container/PrivateRoute'
import Login from './container/Login/Login'
import Dashboard from './container/Dashboard/DashBoard'
import UserSettings from './container/Dashboard/UserSettings'
import Charts from './components/Charts/charts';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import WithErrorHandler from './hoc/withErrorHandler';


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <WithErrorHandler />
        <Router >
          <div>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/userSettings" component={UserSettings} />
            <PrivateRoute exact path="/charts" component={Charts} />
            <Route exact path="/" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;