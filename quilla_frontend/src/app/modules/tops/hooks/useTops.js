import { storeToRefs } from 'pinia'
import { useTopsStore } from '../store/tops'

export default function useTops() {
  const topsStore = useTopsStore()

  const {
    posts,
    loading,
    likedPosts,
    comments,
    loadingComments,
    openCommentsPost
  } = storeToRefs(topsStore)

  const {
    fetchPosts,
    createPost,
    toggleLike,
    deletePost,
    hasLiked,
    toggleComments,
    fetchComments,
    addComment,
    deleteComment
  } = topsStore

  return {
    // State
    posts,
    loading,
    likedPosts,
    comments,
    loadingComments,
    openCommentsPost,
    // Actions
    fetchPosts,
    createPost,
    toggleLike,
    deletePost,
    hasLiked,
    toggleComments,
    fetchComments,
    addComment,
    deleteComment
  }
}
