import React, { useState, useRef } from 'react'
import "../style/createpost.scss"
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const CreatePost = () => {

    const [caption, setCaption] = useState("")
    const [preview, setPreview] = useState(null)
    const fileRef = useRef(null)

    const navigate = useNavigate()
    const { loading, handleCreatePost } = usePost()

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const file = fileRef.current.files[0]
        await handleCreatePost(file, caption)
        navigate('/')
    }

    return (
        <main className='create-post-page'>
            <div className="form-container">

                <h1>Create Post</h1>

                <form onSubmit={handleSubmit}>

                    {/* IMAGE PREVIEW */}
                    <label className='upload-box'>
                        {preview ? (
                            <img src={preview} alt="preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <span>📸</span>
                                <p>Upload Image</p>
                            </div>
                        )}
                        <input 
                            ref={fileRef}
                            type="file" 
                            hidden 
                            onChange={handleImageChange}
                        />
                    </label>

                    {/* CAPTION */}
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write something beautiful..."
                        className='caption-input'
                    />

                    {/* BUTTON */}
                    <button className='submit-btn'>
                        {loading ? "Posting..." : "✨ Create Post"}
                    </button>

                </form>
            </div>
        </main>
    )
}

export default CreatePost