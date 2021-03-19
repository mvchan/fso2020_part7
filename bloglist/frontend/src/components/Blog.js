import React, { useState } from 'react'
const Blog = ({ blog, user, likeOperation, deleteOperation }) => {
    const [visible, setVisible] = useState(false)
    const [likeCount, setLikeCount] = useState(blog.likes)

    const view = { display: visible ? 'none' : '' }
    const hide = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    //using async/await in order to synchronize likes being shown with actual like count
    const likeBlog = async () => {
        await likeOperation(blog.id,{
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: likeCount+1,
            user: blog.user.id
        })

        setLikeCount(likeCount+1)
    }

    const deleteBlog = async () => {
        await deleteOperation(blog)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div className='blogEntry' style={blogStyle}>
            <div className='blogView' style={view}>
                {blog.title} {blog.author} <button className='view' onClick={toggleVisibility}>view</button>
            </div>
            <div className='blogHide' style={hide}>
                {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br/>
                url: {blog.url}<br/>
                likes: {likeCount} <button className='like' onClick={likeBlog}>like</button><br/>
                user: {blog.user.name}<br/>
                {(user && blog.user.username === user.username)
                    ? <button className='delete' onClick={deleteBlog}>delete</button>
                    : null
                }
            </div>
        </div>
    )
}

export default Blog
