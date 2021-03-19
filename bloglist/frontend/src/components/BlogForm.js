import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div className="formDiv">
            <h2>Create a new blog</h2>
            <form onSubmit={addBlog}>
                <div>title: <input id='title' value={title} onChange={({ target }) => setTitle(target.value)} /></div>
                <div>author: <input id='author' value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
                <div>url: <input id='url' value={url} onChange={({ target }) => setUrl(target.value)} /></div>
                <div><button id='create-button' type="submit">create</button></div>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm