/* EXTERNAL PACKAGES */
import { createSlice } from "@reduxjs/toolkit";

/* GLOBAL STATE */
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        /* SET THE FRIENDS INSIDE THE STATE IF USER EXISTS */
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-existent");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        /* THE ACTION.PAYLOAD.POST BASICALLY REPLACES THE OLD POST */
        if (post._id === action.payload.post._id) return action.payload.post;
        /* RETURN THE POST THAT IS REQUESTED */
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;

/* ====================================== NOTES ====================================== */
/* ESSENTIALLY ALL THESE STUFFS ARE JUST FUNCTIONS THAT MODIFY THE GLOBAL STATE */
/* ACTION CONTAINS THE PAYLOAD BUT BASICALLY IT'S JUST ARGUMENTS/PARAMS FOR THE REDUCER FUNCTION */
/* FOR SETLOGIN, ACTION PAYLOAD CONTAINS USER AND TOKEN */
/* =================================================================================== */
