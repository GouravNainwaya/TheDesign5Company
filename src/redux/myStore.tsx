import { configureStore } from '@reduxjs/toolkit'
import myReducer from './dataSlice'

export const myStore = configureStore({
  reducer: {
    posts: myReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof myStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof myStore.dispatch