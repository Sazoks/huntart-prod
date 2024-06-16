import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { RootState } from "../store";

export const fetchMessages = createAsyncThunk('msgs/fetchMessages', async (id) => {
  const { data } = await instance.get(`/chats/${id}/messages/`);
  console.log("fetchMessages", data)
  return data;
})

export const fetchNewPage = createAsyncThunk('msgs/fetchNewPage', async (args, { getState }) => {
  const state = getState();
  const url = state.msgs.next.slice(28);
  const { data } = await instance.get(url);
  console.log("fetchNewPageMsgs", data)
  return data;
})

export const fetchReadMessages = createAsyncThunk('msgs/fetchReadMessages', async (id) => {
  const { data } = await instance.post(`/chats/${id}/read-all-messages/`);
  console.log("fetchReadMessages", data)
  return data;
})

const initialState = {
  status: 'loading',
  next: '',
  items: [],
  // messages: [],
}

const msgsSlice = createSlice({
  name: 'msg',
  initialState,
  reducers: {
    setNewMsg: (state, action) => {
      state.items = [action.payload, ...state.items];
    },
  },
  extraReducers: (builder) => {
    builder
    //fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.items = [];
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.items = action.payload.results;
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.items = [];
        state.status = 'error';
      })

    //fetchNewPage
      .addCase(fetchNewPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewPage.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.results];
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchNewPage.rejected, (state) => {
        state.status = 'error';
      })

    //fetchReadMessages
    .addCase(fetchReadMessages.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchReadMessages.fulfilled, (state, action) => {
      console.log(action.payload)
      console.log("read msgs fulfilled")
      state.status = 'loaded';
    })
    .addCase(fetchReadMessages.rejected, (state) => {
      state.status = 'error';
    })
  }
})


export const msgsReducer = msgsSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.msgs
)

export const selectStatus = createSelector(selectBase, state => state.status);
export const selectNext = createSelector(selectBase, state => state.next);
export const selectMsgs = createSelector(selectBase, state => state.items);

export const {setNewMsg} = msgsSlice.actions;