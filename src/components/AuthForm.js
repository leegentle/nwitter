import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

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
      let data;
      if (newAccount) {
        data = await authService
          .createUserWithEmailAndPassword(email, password)
          .catch(function (error) {
            setError(error.message);
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

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email || ""}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password || ""}
          onChange={onChange}
          className="authInput"
        />
        <input
          className="authInput authSubmit"
          type="submit"
          value={newAccount ? "회원가입" : "로그인"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <button
        type="text"
        onClick={() => toggleAccount()}
        className="authSwitch"
      >
        {newAccount ? "로그인하기" : "회원가입하기"}
      </button>
    </>
  );
};

export default AuthForm;
