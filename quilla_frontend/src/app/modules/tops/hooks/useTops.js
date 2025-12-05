import { storeToRefs } from 'pinia'
import { useTopsStore } from '../store/tops'

export default function useTops() {
  const topsStore = useTopsStore()

  const {
    posts,
    loading,
    likedPosts
  } = storeToRefs(topsStore)

  const {
    fetchPosts,
    createPost,
    toggleLike,
    deletePost,
    hasLiked
  } = topsStore

  return {
    // State
    posts,
    loading,
    likedPosts,

    // Actions
    fetchPosts,
    createPost,
    toggleLike,
    deletePost,
    hasLiked
  }
}
