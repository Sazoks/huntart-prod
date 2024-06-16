import { createSelector, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../shared/api/axios";
import { IUserState } from "../../../entities/UserState";
import { RootState } from "../store";

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const { data } = await instance.get('/users/im/');
  // console.log(data)
  return data;
})
export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (profile) => {
  const { data } = await instance.patch('/users/im/', profile);
  // console.log(data)
  return data;
})
export const fetchNewArt = createAsyncThunk('auth/fetchNewArt', async (art) => {
  const { data } = await instance.post(`/arts/`, art);
  console.log(data)
  return data;
})

const initialUser: IUserState = {
  id: null,
  username: '',
  is_active: false,
  profile: null,
  followers: [],
  followers_count: null,
  subscriptions: [],
  subscriptions_count: null
}
interface IState {
  data: IUserState
  status: string
  profileStatus: string
  artStatus: string
  isAuth: boolean
}
const initialState: IState = {
  data: initialUser,
  status: 'loading',
  profileStatus: 'idle',
  artStatus: 'idle',
  isAuth: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = initialUser;
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    resetProfileStatus: (state) => {
      state.profileStatus = 'idle';
    },
    resetArtStatus: (state) => {
      state.artStatus = 'idle';
    }
    // checkIsSubcribe: (state, action) => {
    //   const subscriptions = state.data?.subscriptions;
    //   console.log(action.payload)
    //   console.log(subscriptions)
    //   const user = subscriptions?.find(item => item.id == action.payload);
    //   state.isMySubscription = !!user;
    //   // return !!user;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.data = initialUser;
        state.status = 'loading';
        state.isAuth = false
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
        state.isAuth = true
      })
      .addCase(fetchMe.rejected, (state) => {
        state.data = initialUser;
        state.status = 'error';
        state.isAuth = false
      })

      //fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.profileStatus = 'loaded';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.profileStatus = 'error';
      })

      //fetchNewArt
      .addCase(fetchNewArt.pending, (state) => {
        state.artStatus = 'loading';
      })
      .addCase(fetchNewArt.fulfilled, (state) => {
        state.artStatus = 'loaded';
      })
      .addCase(fetchNewArt.rejected, (state) => {
        state.artStatus = 'error';
      })
  },
})


export const authReducer = authSlice.reducer;

const selectBase = createSelector(
  (state: RootState) => state,
  (state) => state.auth
)

export const selectStatus = createSelector(selectBase, state => state.status);
export const selectArtStatus = createSelector(selectBase, state => state.artStatus);
export const selectIsAuth = createSelector(selectBase, state => state.isAuth);
export const selectSubscriptionsCount = createSelector(selectBase, state => state.data?.subscriptions_count);
export const selectMyId = createSelector(selectBase, state => state.data?.id);
export const selectMyUsername = createSelector(selectBase, state => state.data?.username);
export const selectSubscriptions = createSelector(selectBase, state => state.data?.subscriptions);
export const selectProfileStatus = createSelector(selectBase, state => state.profileStatus);
export const selectMyDescription = createSelector(selectBase, state => state.data.profile?.description);

// export const selectStatus = (state) => state?.auth?.status;
// export const selectArtStatus = (state) => state.auth.artStatus;
// export const selectIsAuth = (state) => state.auth?.status === 'loaded';//Boolean(state.auth.data);
// export const selectSubscriptionsCount = (state) => state?.auth?.data?.subscriptions_count;
// export const selectMyId = (state) => state.auth?.data?.id;
// export const selectMyUsername = (state) => state.auth?.data?.username;
// export const selectSubscriptions = (state) => state.auth.data?.subscriptions;
// export const selectProfileStatus = (state) => state.auth.profileStatus;
// export const selectMyDescription = (state) => state.auth.data.profile?.description;
// export const selectIsSubcription = (state) => state.auth?.data?.isMySubscription;

export const { logout, resetProfileStatus, resetArtStatus } = authSlice.actions;