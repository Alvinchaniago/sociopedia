/* EXTERNAL PACKAGES */
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* PROJECT IMPORT */
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComment, setIsComment] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  /* SEE IF CURRENT USER HAS LIKED THE POST OR NOT */
  /* IN THE BACKEND THE LIKES IS OF MAP TYPE WHICH MEANS IT LOOKS LIKE THE FOLLOWING */
  /* { USERID1: TRUE, USERID2: TRUE, USERID3: TRUE, ETC } */
  /* CHECK IF THE USER HAS LIKED IT OR NOT THROUGH THE BOOLEAN METHOD */
  const isLiked = Boolean(likes[loggedInUserId]);

  /* GRAB THE NUMBER OF LIKES VIA HOW MANY KEYS THERE ARE */
  const likeCount = Object.keys(likes).length;

  /* COLORS */
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLikes = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {/* RENDER THE IMAGE BELOW */}
      {picturePath && (
        <img
          width="100%"
          heigh="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/* LIKES SECTION */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLikes}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          {/* COMMENTS SECTION */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComment(!isComment)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* DISPLAY THE COMMENTS */}
      {isComment && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
