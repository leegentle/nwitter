import { dbService } from "fbase";
import React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Profile from "routes/Profile";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navi";

const AppRouter = ({ isLoggedIn, user, refreshUser }) => {
  // 디비 변화 감지
  const dbSensor = (func) => {
    dbService.collection("nweet").onSnapshot((snap) => {
      const nweetArr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      func(nweetArr);
    });
  };
  return (
    <Router>
      {isLoggedIn && <Navigation user={user} />}
      <Switch>
        <>
          {isLoggedIn ? (
            <div
              style={{
                maxWidth: 890,
                width: "100%",
                margin: "0 auto",
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Route exact path="/">
                <Home dbSensor={dbSensor} user={user} />
              </Route>
              <Route exact path="/profile">
                <Profile
                  dbSensor={dbSensor}
                  refreshUser={refreshUser}
                  user={user}
                />
              </Route>
            </div>
          ) : (
            <>
              <Route exact path="/">
                <Auth />
              </Route>
              <Redirect from="*" to="/" />
              {/* / 외에 다른데로 갔을때 무적권 /로 보냄 */}
            </>
          )}
        </>
      </Switch>
    </Router>
  );
};

export default AppRouter;
