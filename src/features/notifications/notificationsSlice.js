import {
  // createAsyncThunk,
  createSlice,
  createEntityAdapter,
  createSelector,
  createAction,
  isAnyOf,
} from '@reduxjs/toolkit'
// import { client } from '../../api/client'

import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'

const notificationsReceived = createAction(
  'notifications/notificationsReceived'
)

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket('ws://localhost')
        try {
          await cacheDataLoaded

          const listener = (event) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'notifications': {
                updateCachedData((draft) => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener)
        } catch {}
        await cacheEntryRemoved

        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = extendedApi

const emptyNotifications = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  forceGenerateNotifications(latestTimestamp)
}

const notificationsAdapter = createEntityAdapter()

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)

// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async (_, { getState }) => {
//     const allNotifications = selectAllNotifications(getState())
//     const [latestNotification] = allNotifications
//     const latestTimestamp = latestNotification ? latestNotification.date : ''
//     const response = await client.get(
//       `/fakeApi/notifications?since=${latestTimestamp}`
//     )
//     return response.data
//   }
// )

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      const notificationsMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((notification) => {
        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, notificationsMetadata)
    })
    // .addCase(fetchNotifications.fulfilled, (state, action) => {
    //   // Add client-side metadata for tracking new notifications
    //   const notificationsWithMetadata = action.payload.map((notification) => ({
    //     ...notification,
    //     read: false,
    //     isNew: true,
    //   }))

    //   Object.values(state.entities).forEach((notification) => {
    //     // Any notifications we've read are no longer new
    //     notification.isNew = !notification.read
    //   })

    //   notificationsAdapter.upsertMany(state, notificationsWithMetadata)
    // })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state) => state.notifications)
