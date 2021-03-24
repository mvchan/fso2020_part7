import React from 'react'
const Blog = ({ blog, user, likeOperation, deleteOperation }) => {

    //using async/await in order to synchronize likes being shown with actual like count
    const likeBlog = async () => {
        await likeOperation(blog.id,{
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes+1,
            user: blog.user.id
        })
    }

    const deleteBlog = async () => {
        await deleteOperation(blog)
    }

    if (!user || !blog)
        return null

    return (
        <div className='blogEntry' >
            <h2>{blog.title}</h2>
            <div className='blogHide'>
                <a href={blog.url}>{blog.url}</a><br/>
                {blog.likes} likes <button className='like' onClick={likeBlog}>like</button><br/>
                added by {blog.user.name}<br/>
                {(user && blog.user.username === user.username)
                    ? <button className='delete' onClick={deleteBlog}>delete</button>
                    : null
                }
            </div>
        </div>
    )
}

export default Blog
