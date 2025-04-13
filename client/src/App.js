import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import axios from "axios";

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
import BookPOS from "./pages/BookPOS";
import Customer from "./pages/Customer";

// Styles
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { message } from "antd";

function App() {
  const history = useHistory();
  const [isValidToken, setIsValidToken] = useState(null);
  const token = localStorage.getItem("token");

  // Hàm kiểm tra token có còn hợp lệ không
  const validateToken = async () => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    try {
      // Giả sử backend có API xác thực token
      await axios.get("http://localhost:3001/api/user/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsValidToken(true);
    } catch (err) {
      message.warning("Phiên đăng nhập đã hết hạn!");
      localStorage.removeItem("token");
      setIsValidToken(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (isValidToken === null) {
    return null; // Hoặc loading spinner
  }

  return (
    <div className="App">
      <Switch>
        {/* Public Routes */}
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/reset-password" exact component={ResetPassword} />

        {/* Nếu token không hợp lệ */}
        {!isValidToken ? (
          <Redirect to="/sign-in" />
        ) : (
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/books" component={Books} />
            <Route exact path="/categories" component={Categories} />
            <Route exact path="/orders" component={Orders} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/promotion" component={Promotion} />
            <Route exact path="/bookpos" component={BookPOS} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/customers" component={Customer} />
            <Redirect from="*" to="/dashboard" />
          </Main>
        )}
      </Switch>
    </div>
  );
}

export default App;
