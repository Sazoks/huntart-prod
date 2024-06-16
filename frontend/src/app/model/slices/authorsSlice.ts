import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { RootState } from "../store";
import { IUser } from "../../../entities/User";

export const fetchAuthors = createAsyncThunk('authors/fetchAuthors', async (username) => {
  const { data } = await instance.get(`/users/search/`, { 
    params: {
      page_size: 15,
      username,
    }});

  // console.log(data)
  return data;
})
export const fetchNewPage = createAsyncThunk('authors/fetchNewPage', async (args, { getState }) => {
  const state = getState();
  const url = state.authors.next.slice(28);
  const { data } = await instance.get(url);

  return data;
})

interface IInitialState {
  authors: IUser[]
  status: string
  next: string
}

const initialState : IInitialState = {
  authors: [],
  status: 'idle',
  next: '',
}

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //fetchAuthors
      .addCase(fetchAuthors.pending, (state) => {
        state.authors = [];
        state.status = 'loading';
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload.results;
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchAuthors.rejected, (state) => {
        state.authors = [];
        state.status = 'error';
      })

    //fetchNewPage
      .addCase(fetchNewPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewPage.fulfilled, (state, action) => {
        state.authors = [...state.authors, ...action.payload.results];
        state.next = action.payload.next;
        state.status = 'loaded';
      })
      .addCase(fetchNewPage.rejected, (state) => {
        state.status = 'error';
      })
  }
})

export const authorsReducer = authorsSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.authors
)

export const selectAuthorsUsernames = createSelector(selectBase, state => state.authors.map(item => item.username));
export const selectAuthors = createSelector(selectBase, state => state.authors);