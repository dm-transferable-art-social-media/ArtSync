import { React, useState, useEffect } from "react";
import { heart, heartFilled } from "../assets/Icons.js";
import { like, unlike } from "../../lib/bsky.ts";
import style from "../Styles/postAction.module.css";

const PostAction = ({ uri, cid, likeCount }) => {
    const [likeValue, setLikeValue] = useState(false);
    const [likeCounter, setLikeCounter] = useState(likeCount);
    const [likeUri, setLikeUri] = useState("");
    const posturi = uri;
    const postcid = cid;

    useEffect(() => {
        //console.log('Count is now: ', likeCounter);
    }, [likeCounter]);

    // useEffect(() => {
    //     console.log('This is the post: ', posturi);
    //     console.log('Like is now: ', likeValue);
    //     /*isLiked({ uri: uri, cid: cid }).then(result => setLikeValue(result));
    //     console.log('isLiked? ', likeValue);*/
    // }, [likeValue])

    // useEffect(() => {
    //     console.log('Like Uri: ', likeUri);
    // }, [likeUri])

    async function handleLike() {
        if (likeValue) {
            try {
                //console.log(likeUri);
                /*
                if (likeUri === "") {
                    const likeObj = await like({
                        uri: posturi,
                        cid: postcid
                    });
                    setLikeUri(likeObj.uri);
                }*/
                await unlike({
                    uri: likeUri
                })
                setLikeValue(false);
                setLikeCounter(likeCounter - 1);
                setLikeUri("");
            } catch (e) {
                console.error(e);
            }
        }
        else {
            try {
                const likeObj = await like({
                    uri: posturi,
                    cid: postcid
                });
                //console.log(likeObj.uri);
                setLikeValue(true);
                setLikeCounter(likeCounter + 1);
                setLikeUri(likeObj.uri);
            } catch (e) {
                console.error(e);
            }
        }
    }

    const likeIcons = {
        unliked: heart,
        liked: heartFilled
    }

    return (
        <div>
            <button id={style.like} onClick={handleLike}>
                {likeValue ? likeIcons.liked : likeIcons.unliked} {" " + likeCounter}
            </button>
        </div>
    );
};

export default PostAction;