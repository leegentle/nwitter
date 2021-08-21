import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ user, dbSensor }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    getNweets();
    dbSensor(setNweets);
  }, []);

  // 뉴윗 가져오기
  const getNweets = async () => {
    const dbnweets = await dbService.collection("nweet").get();
    // 데이터에 접근할땐 이렇게
    // https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get
    let obj = [];
    dbnweets.forEach((doc) => {
      const newNweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      obj.push(newNweetObj);
    });
    setNweets(obj);
  };
  // 디비 변화 감지
  // const dbSensor = () => {
  //   dbService.collection("nweet").onSnapshot((snap) => {
  //     const nweetArr = snap.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setNweets(nweetArr);
  //   });
  // };

  return (
    <div>
      {/* 뉴윗 생성 */}
      <NweetFactory user={user} />
      <div>
        {nweets.map((nweet) => {
          return (
            <Nweet
              key={nweet.id}
              nweet={nweet}
              isOwner={nweet.user_id === user.uid}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Home;
