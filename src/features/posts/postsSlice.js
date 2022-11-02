// import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
// import { client } from '../../api/client'

// const postAdaper = createEntityAdapter({
//   sortComparer: (a, b) => b.date.localeCompare(a.date)
// })

// const initialState = postAdaper.getInitialState({
//   status: 'idle',
//   error: null,
// })

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
//   const response = await client.get('/fakeApi/posts')
//   return response.data
// })

// export const addNewPost = createAsyncThunk(
//   'posts/addNewPost',
//   // The payload creator receives the partial `{title, content, user}` object
//   async (initialPost) => {
//     // We send the initial data to the fake API server
//     const response = await client.post('/fakeApi/posts', initialPost)
//     // The response includes the complete post object, including unique ID
//     return response.data
//   }
// )

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {
//     reactionAdded(state, action) {
//       const { postId, reaction } = action.payload
//       const existingPost = state.entities[postId]
//       if (existingPost) {
//         existingPost.reactions[reaction]++
//       }
//     },
//     postUpdated(state, action) {
//       const { id, title, content } = action.payload
//       const existingPost = state.entities[id]
//       if (existingPost) {
//         existingPost.title = title
//         existingPost.content = content
//       }
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchPosts.pending, (state, action) => {
//         state.status = 'loading'
//       })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = 'succeeded'
//         // Add any fetched posts to the array
//         // Use the `upsertMany` reducer as a mutating update utility
//         postAdaper.upsertMany(state, action.payload)
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.status = 'failed'
//         state.error = action.error.message
//       })
//       // Use the `addOne` reducer for the fulfilled case
//       .addCase(addNewPost.fulfilled, postAdaper.addOne)
//   },
// })

// export const { postUpdated, reactionAdded } = postsSlice.actions

// export default postsSlice.reducer

// // Export the customized selectors for this adapter using `getSelectors`
// export const {
//   selectAll: selectAllPosts,
//   selectById: selectPostById,
//   selectIds: selectPostIds
// } = postAdaper.getSelectors(state => state.posts)

// export const selectPostsByUser = createSelector(
//   // Since the user ID is the second argument we're passing into 
//   // selectPostsByUser, we can write a small selector that just returns userId.
//   [selectAllPosts, (state, userId) => userId],
//   (posts, userId) => posts.filter((post) => post.user === userId)
// )
