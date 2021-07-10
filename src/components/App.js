import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import ChatList from "./ChatList";
import Login from "./Login";
import AuthProvider, { useAuth } from "../contexts/auth.context";
import ChatRoom from "./ChatRoom";

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={ChatList} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute path="/:roomId" component={ChatRoom} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
