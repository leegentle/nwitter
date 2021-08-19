import { useState } from "react";
import AppRouter from "components/router";
import { authService } from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); // 유저 여부

  return <AppRouter isLoggedIn={isLoggedIn} />;
}

export default App;
