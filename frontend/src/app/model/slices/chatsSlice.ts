import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { RootState } from "../store";

export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  const { data } = await instance.get('/chats/');
  // console.log("fetchChats", data)
  return data;
})

export const fetchNewPage = createAsyncThunk('chats/fetchNewPage', async (args, { getState }) => {
  const state = getState();
  const url = state.chats.next.slice(28);
  const { data } = await instance.get(url);
  // console.log(data)
  return data;
})

const initialState = {
  status: 'loading',
  next: '',
  items: [],
  activeChat: null,
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    setActive: (state, action) => {
      state.activeChat = action.payload;
    },
    setChatActive: (state, action) => {
      const newArr = state.items?.map(item => {
        if (item.id != action.payload) {
          return {...item, active: false};
        }
        return {...item, active: true};
      })
      state.items = newArr;
    },
    setChatReaded: (state, action) => {
      const tempArr = state.items.slice();
      tempArr.map(chat => {
        if (chat?.id != action.payload) return chat;
        chat.has_unread_messages = false;
        return chat;
      })
      state.items = tempArr;
    },
    setChatUnreaded: (state, action) => {
      const tempArr = state.items.slice();
      tempArr.map(chat => {
        if (chat?.id != action.payload) return chat;
        chat.has_unread_messages = true;
        return chat;
      })
      state.items = tempArr;
    },
  },
  extraReducers: (builder) => {
    builder
    //fetchChats
      .addCase(fetchChats.pending, (state) => {
        state.items = [];
        state.status = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        const newChats = action.payload.results?.map(user => {
          const tempObj = {
            id: user.user_id,
            username: user.name,
            avatar: user.avatar,
            has_unread_messages: user.has_unread_messages,
            active: false
          }
          if (state.activeChat && state.activeChat == user.user_id)  tempObj.active = true;
          return  tempObj;
        })
        state.items = newChats;
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchChats.rejected, (state) => {
        state.items = [];
        state.status = 'error';
      })

    //fetchNewPage
      .addCase(fetchNewPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewPage.fulfilled, (state, action) => {
        const newChats = action.payload.results?.map(user => {
          const tempObj = {
            id: user.user_id,
            username: user.name,
            avatar: user.avatar,
            has_unread_messages: user.has_unread_messages,
            active: false
          }
          if (state.activeChat && state.activeChat == user.user_id)  tempObj.active = true;
          return  tempObj;
        })
        state.items = [...state.items, ...newChats];
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchNewPage.rejected, (state) => {
        state.status = 'error';
      })
  }
})


export const chatsReducer = chatsSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.chats
)

export const selectStatus = createSelector(selectBase, state => state.status);
export const selectNext = createSelector(selectBase, state => state.next);
export const selectChats = createSelector(selectBase, state => state.items);
export const selectActiveChat = createSelector(selectBase, state => state.activeChat);

export const {setChatReaded, setChatUnreaded, addChat, setChatActive, setActive} = chatsSlice.actions;