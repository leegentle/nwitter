import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ user }) => {
  const [nweet, setNweet] = useState("");
  const [nImg, setNImg] = useState("");
  // 글쓰기 버튼
  const onSubmit = async (e) => {
    e.preventDefault();
    if (nweet === "") {
      alert("내용을 입력해 주세요");
      return;
    }
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
    setNImg("");
  };
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet || ""}
          onChange={onChange}
          type="text"
          placeholder="무슨생각해?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>사진 올리기</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>

      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {nImg && (
        <div className="factoryForm__attachment">
          <img
            src={nImg}
            style={{
              backgroundImage: nImg,
            }}
          />
          <div className="factoryForm__clear" onClick={cencleImg}>
            <span>취소</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
