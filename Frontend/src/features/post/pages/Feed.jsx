import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from "../components/Post"
import { usePost } from '../hook/usePost'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import { StoriesBar } from '../components/Stories'  // ← ADD

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
    handleGetFeed()
  }, [currentUser, checkedAuth])

  if(!checkedAuth || loading || !feed){
    return (<main><h1>Feed is Loading....</h1></main>)
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

