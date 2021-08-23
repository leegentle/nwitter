import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ user, dbSensor }) => {
  const [nweets, setNweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loading && getNweets();
    dbSensor(setNweets);

    return () => setLoading(false);
  }, [loading, dbSensor]);

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

  return (
    <div className="container">
      {/* 뉴윗 생성 */}
      <NweetFactory user={user} />
      <div style={{ marginTop: 30 }}>
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
