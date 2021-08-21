import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweet, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweet.text);

  // 삭제
  const onDelete = async () => {
    const ok = window.confirm("진짜 삭제할라고?");
    if (ok) {
      await dbService.doc(`nweet/${nweet.id}`).delete(); // id가지고 게시물 삭제

      nweet.nImgUrl !== "" &&
        (await storageService.refFromURL(nweet.nImgUrl).delete()); // 게시물의 사진 삭제
    } else {
      return;
    }
  };

  // 수정 토글
  const editToggle = () => {
    setEditing((prev) => !prev);
  };
  // 수정 완료
  const onSubmit = async (e) => {
    console.log("dd");
    e.preventDefault();
    await dbService.doc(`nweet/${nweet.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  // 수정 텍스트
  const onChange = (text) => {
    const {
      target: { value },
    } = text;

    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="수정해주세요"
                  value={newNweet}
                  onChange={onChange}
                  required
                />
                <input type="submit" value="수정" />
              </form>
              <button onClick={editToggle} type="button">
                취소
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.nImgUrl && (
            <img src={nweet.nImgUrl} alt="" width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDelete} type="button">
                delete Nweet
              </button>
              <button onClick={editToggle} type="button">
                edit Nweet
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
