import { useEffect, useState } from "react";
import AppRouter from "components/router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false); // 파이어베이스 초기회 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 유저 여부

  useEffect(() => {
    isUser();
  }, []);

  // 유저 여부
  const isUser = () => {
    authService.onAuthStateChanged((user) => {
      // 유저의 상태가 바뀌면 실행됨
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  };

  return <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : "초기화중"}</>;
}
export default App;
