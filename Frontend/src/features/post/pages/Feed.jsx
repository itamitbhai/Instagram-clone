import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from "../components/Post"
import { usePost } from '../hook/usePost'
import { useAuth } from '../../auth/hooks/useAuth'

const Feed = () => {

    const {feed, handleGetFeed, loading, handleLike, handleUnLike, handleDeletePost} = usePost()
    const { user: currentUser } = useAuth()
    useEffect(() => {
        handleGetFeed()
    }, [])

    if(loading || !feed){
        return (<main><h1>Feed is Loading....</h1></main>)
    }

    console.log(feed)



  return (
    <main className='feed-page'>
      <div className='feed'>
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
