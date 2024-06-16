import { configureStore } from "@reduxjs/toolkit";
import { artsReducer } from "./slices/artsSlice";
import { artReducer } from "./slices/artSlice";
import { authReducer } from "./slices/authSlice"
import { userReducer } from "./slices/userSlice";
import { authorsReducer } from "./slices/authorsSlice";
import { chatsReducer } from "./slices/chatsSlice";
import { msgsReducer } from "./slices/msgsSlice";

const store = configureStore({
  reducer: {
    arts: artsReducer,
    art: artReducer,
    auth: authReducer,
    user: userReducer,
    authors: authorsReducer,
    chats: chatsReducer,
    msgs: msgsReducer,
  }
})

export default store;

export type RootState = ReturnType<typeof store.getState>