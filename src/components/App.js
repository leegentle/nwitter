import { useEffect, useState } from "react";
import AppRouter from "components/router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false); // 파이어베이스 초기회 여부
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    isUser();
  }, []);

  // 유저 여부
  const isUser = () => {
    // 유저의 인증 상태가 바뀌면 실행됨
    authService.onAuthStateChanged((user) => {
      // 그냥 user 넣어도 되는데 크기가 존나커서 업데이트할때 애가 정신못차려서 덩지 줄여줌
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  };

  // 유저 업데이트 => 업데이트하자마자 Navi도 실시간으로 업데이트하고싶어서 이거해줌
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          user={userObj}
        />
      ) : (
        "초기화중"
      )}
    </>
  );
}
export default App;
