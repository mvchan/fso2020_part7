import React from 'react'

const Blog = ({ blog, user, likeOperation, deleteOperation, commentOperation }) => {

    //using async/await in order to synchronize likes being shown with actual like count
    const likeBlog = async () => {
        await likeOperation(blog.id,{
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes+1,
            user: blog.user.id,
            comments: blog.comments
        })
    }

    const deleteBlog = async () => {
        await deleteOperation(blog)
    }

    const addComment = (event) => {
        event.preventDefault()

        if (!event.target.comment.value)
            return

        commentOperation(blog.id,event.target.comment.value)
        event.target.comment.value = ''
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
            <h3>comments</h3>
            <form onSubmit={addComment}>
                <input name='comment' /><button type="submit">add comment</button>
            </form>
            <ul>
                {blog.comments.map(comment => (
                    <li key={comment} >{comment}</li>
                ))}
            </ul>
        </div>
    )
}

export default Blog
