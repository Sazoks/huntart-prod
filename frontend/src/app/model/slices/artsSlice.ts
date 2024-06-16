import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { RootState } from "../store";

const setParams = (author: string, tags: string[]) => {

  const params = new URLSearchParams();

  params.append('page_size', '15')

  if (author != '') {
    console.log(author)
    params.append('author', author);
  }

  if (tags.length > 0) {
    tags.forEach(tag => params.append('tags', tag))
  }

  return params;
}

export const fetchNewArts = createAsyncThunk('arts/fetchNewArts', async (args, { getState }) => {
  const state = getState();
  const author = state.arts.search.username;
  const tags = state.arts.search.tags;

  const params = setParams(author, tags);

  const { data } = await instance.get('/arts/new/', {params});
  // console.log(data)
  return data;
})
export const fetchPopularArts = createAsyncThunk('arts/fetchPopularArts', async (args, { getState }) => {
  const state = getState();
  const author = state.arts.search.username;
  const tags = state.arts.search.tags;

  const params = setParams(author, tags);

  const { data } = await instance.get('/arts/popular/', {params});

  return data;
})
export const fetchSubscriptionsArts = createAsyncThunk('arts/fetchSubscriptionsArts', async (args, { getState }) => {
  const state = getState();
  const author = state.arts.search.username;
  const tags = state.arts.search.tags;

  const params = setParams(author, tags);
  
  const { data } = await instance.get('/arts/subscriptions/', {params});

  return data;
})
export const fetchUserArts = createAsyncThunk('arts/fetchUserArts', async (id) => {
  const { data } = await instance.get(`/arts/users/${id}/`, { 
    params: {
      page_size: 15
    }});

  // console.log(data)
  return data;
})

export const fetchNewPage = createAsyncThunk('arts/fetchNewPage', async (args, { getState }) => {
  const state = getState();
  const url = state.arts.arts.next.slice(28);
  const { data } = await instance.get(url);

  return data;
})

const initialState = {
  arts: {
    items: [],
    status: 'loading',
    next: '',
  },
  feedName: 'новые работы',
  search: {
    username: '',
    tags: [],
  }
}

const artsSlice = createSlice({
  name: 'arts',
  initialState,
  reducers: {
    setFeedName: (state, action) => {
      state.feedName = action.payload;
    },
    setSearchUsername: (state, action) => {
      state.search.username = action.payload;
    },
    setSearchTags: (state, action) => {
      // console.log('payload', action.payload)
      state.search.tags = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    //fetchNewArts
      .addCase(fetchNewArts.pending, (state) => {
        state.arts.items = [];
        state.arts.status = 'loading';
      })
      .addCase(fetchNewArts.fulfilled, (state, action) => {
        state.arts.items = action.payload.results;
        state.arts.next = action.payload.next;
        state.arts.status = 'loaded';
      })
      .addCase(fetchNewArts.rejected, (state) => {
        state.arts.items = [];
        state.arts.status = 'error';
      })
    //fetchPopularArts
      .addCase(fetchPopularArts.pending, (state) => {
        state.arts.items = [];
        state.arts.status = 'loading';
      })
      .addCase(fetchPopularArts.fulfilled, (state, action) => {
        state.arts.items = action.payload.results;
        state.arts.next = action.payload.next;
        state.arts.status = 'loaded';
      })
      .addCase(fetchPopularArts.rejected, (state) => {
        state.arts.items = [];
        state.arts.status = 'error';
      })
    //fetchSubscriptionsArts
      .addCase(fetchSubscriptionsArts.pending, (state) => {
        state.arts.items = [];
        state.arts.status = 'loading';
      })
      .addCase(fetchSubscriptionsArts.fulfilled, (state, action) => {
        state.arts.items = action.payload.results;
        state.arts.next = action.payload.next;
        state.arts.status = 'loaded';
      })
      .addCase(fetchSubscriptionsArts.rejected, (state) => {
        state.arts.items = [];
        state.arts.status = 'error';
      })
    //fetchUserArts
      .addCase(fetchUserArts.pending, (state) => {
        state.arts.items = [];
        state.arts.status = 'loading';
      })
      .addCase(fetchUserArts.fulfilled, (state, action) => {
        state.arts.items = action.payload.results;
        state.arts.next = action.payload.next;
        state.arts.status = 'loaded';
      })
      .addCase(fetchUserArts.rejected, (state) => {
        state.arts.items = [];
        state.arts.status = 'error';
      })

    //fetchNewPage
      .addCase(fetchNewPage.pending, (state) => {
        state.arts.status = 'loading';
      })
      .addCase(fetchNewPage.fulfilled, (state, action) => {
        state.arts.items = [...state.arts.items, ...action.payload.results];
        state.arts.next = action.payload.next;
        state.arts.status = 'loaded';
      })
      .addCase(fetchNewPage.rejected, (state) => {
        state.arts.status = 'error';
      })
  }
})


export const artsReducer = artsSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.arts
)

export const selectStatus = createSelector(selectBase, state => state?.arts?.status);
export const selectNext = createSelector(selectBase, state => state?.arts?.next);
export const selectFeedName = createSelector(selectBase, state => state?.feedName);
export const selectSearchUsername = createSelector(selectBase, state => state.search.username);

export const {setFeedName, setSearchUsername, setSearchTags} = artsSlice.actions;