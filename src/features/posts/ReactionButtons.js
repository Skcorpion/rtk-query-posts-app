import React from 'react'
// import { useDispatch } from 'react-redux'
import { useAddReactionMutation } from '../api/apiSlice'

// import { reactionAdded } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }) => {
  // const dispatch = useDispatch()
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(([reactionName, emoji]) => {
    return (
      <button
        key={reactionName}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          // dispatch(reactionAdded({ postId: post.id, reaction: reactionName }))
          addReaction({postId: post.id, reaction: reactionName})
        }
      >
        {emoji} {post.reactions[reactionName]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
