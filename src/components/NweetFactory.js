import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ user }) => {
  const [nweet, setNweet] = useState("");
  const [nImg, setNImg] = useState("");
  // 글쓰기 버튼
  const onSubmit = async (e) => {
    e.preventDefault();
    let nImgUrl = "";
    if (nImg !== "") {
      const nImgRef = storageService.ref().child(`${user.uid}/${uuidv4()}`); //이미지 경로 및 이름 지정 => user.id가 경로, uuid가 이름
      const res = await nImgRef.putString(nImg, "data_url");
      nImgUrl = await res.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      created_at: Date.now(),
      user_id: user.uid,
      nImgUrl,
    };
    await dbService.collection("nweet").add(nweetObj);
    setNweet("");
    setNImg("");
  };
  // text input
  const onChange = (text) => {
    const {
      target: { value },
    } = text;
    setNweet(value);
  };
  // 이미지 업로드
  const onFileChange = (file) => {
    const {
      target: { files },
    } = file;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNImg(result);
    };
    reader.readAsDataURL(theFile);
  };
  // 이미지 업로드 취소
  const cencleImg = () => {
    setNImg(null);
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet || ""}
        onChange={onChange}
        type="text"
        placeholder="무슨생각해?"
        maxLength={120}
      />
      <input onChange={onFileChange} type="file" accept="image/*" />
      <input type="submit" value="글쓰기" />
      {nImg && (
        <div>
          <img src={nImg} alt="뉴위터 이미지" width="50px" height="50px" />
          <button onClick={cencleImg}>취소</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
