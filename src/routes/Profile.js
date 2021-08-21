import Nweet from "components/Nweet";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ user, refreshUser, dbSensor }) => {
  let history = useHistory(); // history

  const [editText, setEditTxt] = useState(user.displayName);
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    getMyNweets();
    dbSensor(setNweets);
  }, []);

  // 내꺼 뉴윗만 가져오기
  const getMyNweets = async () => {
    const data = await dbService
      .collection("nweet")
      .where("user_id", "==", user.uid) // 조건부 get
      .orderBy("created_at", "asc") // 정렬도 가능, asc랑desc 따로 인덱싱 작업해줘야함 => 파이어베이스가 해줌 시간은좀 걸림ㅋㅋ
      .get();
    const mine = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(mine);
    setNweets(mine);
  };
  //로그아웃
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  // 텍스트함수
  const onChange = (text) => {
    const {
      target: { value },
    } = text;
    setEditTxt(value);
  };
  //수정 완료
  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.displayName !== editText) {
      await user.updateProfile({
        displayName: editText,
      });
    }
    refreshUser();
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={editText}
          type="text"
          placeholder="씨발"
        />
        <input type="submit" value="확인" />
      </form>
      {nweets.map((nweet) => {
        return (
          <Nweet
            key={nweet.id}
            nweet={nweet}
            isOwner={nweet.user_id === user.uid}
          />
        );
      })}
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
};
export default Profile;
