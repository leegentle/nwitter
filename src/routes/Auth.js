import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import React from "react";

const Auth = () => {
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
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          구글로 로그인
        </button>
        <button onClick={onSocialClick} name="github">
          깃허브로 로그인
        </button>
      </div>
    </div>
  );
};
export default Auth;
