import { configureStore } from '@reduxjs/toolkit'
import { homeSlice } from './reducers/home'

export const store = configureStore({
  reducer: {home: homeSlice.reducer},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TuRootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
