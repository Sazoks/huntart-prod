import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { RootState } from "../store";

//ART
export const fetchArt = createAsyncThunk('art/fetchArt', async (id) => {
  const { data } = await instance.get(`/arts/${id}/`);
  // console.log(data)
  return data;
})
//LIKE
export const fetchSetLike = createAsyncThunk('art/fetchSetLike', async (id) => {
  const { data } = await instance.post(`/arts/${id}/like/`);
  // console.log(data)
  return data;
})
export const fetchUnsetLike = createAsyncThunk('art/fetchUnsetLike', async (id) => {
  const { data } = await instance.delete(`/arts/${id}/like/`);
  // console.log(data)
  return data;
})
//Comments
export const fetchComments = createAsyncThunk('art/fetchComments', async (id) => {
  const { data } = await instance.get(`/arts/${id}/comments/`);
  // console.log(data)
  return data;
})
export const fetchNextComments = createAsyncThunk('arts/fetchNextComments', async (args, { getState }) => {
  const state = getState();
  const url = state.art.comments.next.slice(28);
  // console.log("url", url)
  const { data } = await instance.get(url);

  return data;
})
export const fetchComment = createAsyncThunk('art/fetchComment', async ({id, text}) => {
  const { data } = await instance.post(`/arts/${id}/comments/`, {
    text,
  });
  // console.log(data)
  return data;
})

const initialArt = {
  id: null,
  author: {
    username: 'Имя_автора',
    id: null
  },
  image: null,
  tags: null,
  description: null,
  views: 0,
  count_likes: 0,
  liked_authorized_user: false
}

const initialComments = {
  items: [],
  next: null,
  status: 'loading'
}

const initialState = {
  data: initialArt,
  comments: initialComments,
  status: 'loading',
  statusLike: 'loading'
}

const artSlice = createSlice({
  name: 'art',
  initialState,
  reducers: {
    // setLike: (state) => {
    //   state.data.count_likes = state.data.count_likes + 1;
    // }
  },
  extraReducers: (builder) => {
    builder
    //fetchArt
      .addCase(fetchArt.pending, (state) => {
        state.data = initialArt;
        state.status = 'loading';
        state.statusLike = 'loading';
      })
      .addCase(fetchArt.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchArt.rejected, (state) => {
        state.data = initialArt;
        state.status = 'error';
      })

    //fetchSetLike
    .addCase(fetchSetLike.pending, (state) => {
      state.statusLike = 'loading';
    })
    .addCase(fetchSetLike.fulfilled, (state) => {
      state.data.count_likes = state.data.count_likes + 1;
      state.data.liked_authorized_user = true;
      state.statusLike = 'loaded';
    })
    .addCase(fetchSetLike.rejected, (state, action) => {
      state.statusLike = 'error';
      console.log(action)
    })

    //fetchUnsetLike
    .addCase(fetchUnsetLike.pending, (state) => {
      state.statusLike = 'loading';
    })
    .addCase(fetchUnsetLike.fulfilled, (state) => {
      state.data.count_likes = state.data.count_likes - 1;
      state.data.liked_authorized_user = false;
      state.statusLike = 'loaded';
    })
    .addCase(fetchUnsetLike.rejected, (state) => {
      state.statusLike = 'error';
    })

    //fetchComments
    .addCase(fetchComments.pending, (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    })
    .addCase(fetchComments.fulfilled, (state, action) => {
      state.comments.items = action.payload.results;
      state.comments.next = action.payload.next;
      state.comments.status = 'loaded';
    })
    .addCase(fetchComments.rejected, (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    })
    //fetchNextComments
    .addCase(fetchNextComments.pending, (state) => {
      state.comments.status = 'loading';
    })
    .addCase(fetchNextComments.fulfilled, (state, action) => {
      state.comments.items = [...state.comments.items, ...action.payload.results];
      state.comments.next = action.payload.next;
      state.comments.status = 'loaded';
    })
    .addCase(fetchNextComments.rejected, (state) => {
      state.comments.status = 'error';
    })

    //fetchComment
    .addCase(fetchComment.pending, (state) => {
      state.comments.status = 'loading';
    })
    .addCase(fetchComment.fulfilled, (state, action) => {
      state.comments.items = [action.payload, ...state.comments.items];
      state.comments.status = 'loaded';
    })
    .addCase(fetchComment.rejected, (state) => {
      state.comments.status = 'error';
    })
  },
})


export const artReducer = artSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.art
)

export const selectId = createSelector(selectBase, state => state.data?.id);
export const selectUsername = createSelector(selectBase, state => state.data?.author?.username);
export const selectAuthorId = createSelector(selectBase, state => state.data?.author?.id);
export const selectUrl = createSelector(selectBase, state => state.data?.image);
export const selectTags = createSelector(selectBase, state => state?.data?.tags);
export const selectDescription = createSelector(selectBase, state => state?.data?.description);
export const selectViews = createSelector(selectBase, state => state?.data?.views);
export const selectCountLikes = createSelector(selectBase, state => state?.data?.count_likes);
export const selectIsLiked = createSelector(selectBase, state => state?.data?.liked_authorized_user);

export const selectStatus = createSelector(selectBase, state => state.status);
export const selectLikeStatus = createSelector(selectBase, state => state.statusLike);
export const selectCommStatus = createSelector(selectBase, state => state.comments?.status);

export const selectComments = createSelector(selectBase, state => state?.comments?.items);

export const selectCommNext = createSelector(selectBase, state => state?.comments?.next);