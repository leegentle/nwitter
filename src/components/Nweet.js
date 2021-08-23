import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="수정해주세요"
                  value={newNweet}
                  autoFocus
                  onChange={onChange}
                  className="formInput"
                  required
                />
                <input type="submit" value="수정" className="formBtn" />
              </form>
              <button onClick={editToggle} className="formBtn cancelBtn">
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.nImgUrl && <img src={nweet.nImgUrl} alt="뉴윗 이미지" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={editToggle}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
