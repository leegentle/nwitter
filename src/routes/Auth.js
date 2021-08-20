import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [newAccount, setNewAccount] = useState(true);

  // 아이디, 비번 입력
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  // 엔터
  const onSubmit = async (e) => {
    console.log("dd");
    e.preventDefault();
    try {
      console.log(email);
      console.log(password);
      let data;
      if (newAccount) {
        data = await authService
          .createUserWithEmailAndPassword(email, password)
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/weak-password") {
              alert("The password is too weak.");
            } else {
              alert(errorMessage);
            }
            console.log(error);
          }); // 회원가입하면 자동으로 로그인됨
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 로그인, 회원가입 변경
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  // 소셜로그인
  const onSocialClick = (e) => {
    const {
      target: { name },
    } = e;

    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email || ""}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password || ""}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "회원가입" : "로그인"} />
      </form>
      <div>
        <button onClick={onSocialClick} name="google">
          구글로 로그인
        </button>
        <button onClick={onSocialClick} name="github">
          깃허브로 로그인
        </button>
        <button type="text" onClick={() => toggleAccount()}>
          {newAccount ? "로그인하기" : "회원가입하기"}
        </button>
      </div>
    </div>
  );
};
export default Auth;
