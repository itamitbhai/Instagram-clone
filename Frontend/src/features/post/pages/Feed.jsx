import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from "../components/Post"
import { usePost } from '../hook/usePost'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import { StoriesBar } from '../components/Stories'  // ← ADD
import { FeedSkeleton } from '../../shared/components/Skeleton'

const Feed = () => {
  const navigate = useNavigate();
  const { user: currentUser, checkedAuth } = useAuth()
  const {feed, handleGetFeed, loading, handleLike, handleUnLike, handleDeletePost} = usePost(currentUser)

  useEffect(() => {
    if(!checkedAuth) return
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // feed already loaded (e.g. context kept it from before) — no need to
    // re-fetch and blank the page out again
    if (feed) return
    handleGetFeed()
  }, [currentUser, checkedAuth])

  if (!checkedAuth || !feed) {
    return (<main className='feed-page'><FeedSkeleton /></main>)
  }

  return (
    <main className='feed-page'>
      <div className='feed'>
        <StoriesBar currentUser={currentUser} />  {/* ← ADD */}
        <div className='posts'>
          {feed.map(post => {
            return <Post 
                      key={post._id}
                      user={post.user}
                      post={post} 
                      loading={loading} 
                      handleLike={handleLike}  
                      handleUnLike={handleUnLike}
                      handleDeletePost={handleDeletePost}
                      currentUser={currentUser}
                    />
          })}
        </div>
      </div>
    </main>
  )
}

export default Feed

