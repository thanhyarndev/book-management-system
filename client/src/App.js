import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Layout
import Main from "./components/layout/Main";

// Pages
import Home from "./pages/Home";
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Promotion from "./pages/Promotion";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Styles
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import BookPOS from "./pages/BookPOS";

function App() {
  return (
    <div className="App">
      <Switch>
        {/* Public Routes */}
        {/* <Route path="/sign-in" exact component={SignIn} /> */}
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/reset-password" exact component={ResetPassword} />

        {/* Main Routes */}
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/books" component={Books} />
          <Route exact path="/categories" component={Categories} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/promotion" component={Promotion} />
          <Route exact path="/bookpos" component={BookPOS} />
          <Route exact path="/profile" component={Profile} />
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
