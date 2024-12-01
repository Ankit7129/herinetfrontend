const initialState = {
    posts: [],
    visibleComments: {},
    comments: {},
    shareLinks: {},
  };
  
  const feedReducer = (state, action) => {
    switch (action.type) {
      case "SET_POSTS":
        return { ...state, posts: action.payload };
      case "TOGGLE_COMMENTS":
        return { ...state, visibleComments: { ...state.visibleComments, [action.payload]: !state.visibleComments[action.payload] } };
      case "ADD_COMMENT":
        return {
          ...state,
          comments: { ...state.comments, [action.payload.postId]: [...(state.comments[action.payload.postId] || []), action.payload.comment] },
        };
      case "SET_SHARE_LINK":
        return { ...state, shareLinks: { ...state.shareLinks, [action.payload.postId]: action.payload.link } };
      default:
        return state;
    }
  };
  
  export { feedReducer, initialState };
  