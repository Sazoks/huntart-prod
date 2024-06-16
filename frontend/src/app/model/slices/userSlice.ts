import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { IUserState } from "../../../entities/UserState";
import { RootState } from "../store";

//USER
export const fetchUser = createAsyncThunk('user/fetchUser', async (id) => {
  const { data } = await instance.get(`/users/${id}/`);
  // console.log(data)
  return data;
})
//SUBSCRIBE
export const fetchSubscribe = createAsyncThunk('user/fetchSubscribe', async (id) => {
  const { data } = await instance.post(`users/${id}/subscribe/`);
  // console.log(data)
  return data;
})
export const fetchUnsubscribe = createAsyncThunk('user/fetchUnsubscribe', async (id) => {
  const { data } = await instance.delete(`users/${id}/unsubscribe/`);
  // console.log(data)
  return data;
})

const initialUser: IUserState = {
  id: null,
  username: '',
  is_active: false,
  profile: null,
  followers: null,
  followers_count: null,
  subscriptions: null,
  subscriptions_count: null
}
const initialState = {
  data: initialUser,
  status: 'loading'
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    subscribe: (state, action) => {
      state.data.followers_count = state.data.followers_count + 1;
      state.data.followers = [...state.data.followers, action.payload]
    },
    unsubscribe: (state, action) => {
      state.data.followers_count = state.data.followers_count - 1;
      const followers = state.data.followers;
      const newFollowers = followers?.filter(item => item.id != action.payload);
      state.data.followers = newFollowers;
    },
  },
  extraReducers: (builder) => {
    builder
    //fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.data = initialUser;
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchUser.rejected, (state) => {
        state.data = initialUser;
        state.status = 'error';
      })

    //fetchSubscribe
    .addCase(fetchSubscribe.pending, (state) => {
      // state.data = initialUser;
      state.status = 'loading';
    })
    .addCase(fetchSubscribe.fulfilled, (state) => {
      // state.data = action.payload;
      state.status = 'loaded';
    })
    .addCase(fetchSubscribe.rejected, (state) => {
      // state.data = initialUser;
      state.status = 'error';
    })
    //fetchUnsubscribe
    .addCase(fetchUnsubscribe.pending, (state) => {
      // state.data = initialUser;
      state.status = 'loading';
    })
    .addCase(fetchUnsubscribe.fulfilled, (state) => {
      // state.data = action.payload;
      state.status = 'loaded';
    })
    .addCase(fetchUnsubscribe.rejected, (state) => {
      // state.data = initialUser;
      state.status = 'error';
    })
  }
})

export const userReducer = userSlice.reducer;

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.user
)

export const selectStatus = createSelector(selectBase, state => state.status);
export const selectUserId = createSelector(selectBase, state => state.data.id);
export const selectWallpaper = createSelector(selectBase, state => state.data.profile?.wallpaper);
export const selectAvatar = createSelector(selectBase, state => state.data.profile?.avatar);
export const selectDescription = createSelector(selectBase, state => state.data.profile?.description);
export const selectUsername = createSelector(selectBase, state => state.data.username);
export const selectFollowersCount = createSelector(selectBase, state => state.data.followers_count);
export const selectUserSubscriptions = createSelector(selectBase, state => state.data.subscriptions);
export const selectUserFollowers = createSelector(selectBase, state => state.data.followers);

export const { subscribe, unsubscribe} = userSlice.actions;