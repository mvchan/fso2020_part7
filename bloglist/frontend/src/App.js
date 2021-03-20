import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { createNewBlog, initializeBlogs, removeBlog, updateBlog, setToken } from './reducers/blogReducer'
import { setNormalMessage, setErrorMessage } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {

    const blogs = useSelector(state => state.blogs)
    const notification = useSelector(state => state.notification)
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    //empty array will result in only executing once on first-time render
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            dispatch(setToken(user.token))
        }
    }, [dispatch])

    const handleLogin = async (loginObject) => {
        try {
            const user = await loginService.login(loginObject)

            //allows login to persist on re-render
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )

            dispatch(setToken(user.token))
            setUser(user)
        } catch (exception) {
            dispatch(setErrorMessage('wrong username or password'))
        }
    }

    const handleBlogCreation = async (blogObject) => {
        try {
            dispatch(createNewBlog(blogObject))
            blogFormRef.current.toggleVisibility()
            dispatch(setNormalMessage(`a new blog titled '${blogObject.title}' by ${blogObject.author} has been added`))
        } catch (exception) {
            dispatch(setErrorMessage('Could not create new blog'))
        }
    }

    const handleLikeOperation = async (id, blogObject) => {
        try {
            dispatch(updateBlog(id,blogObject))
        } catch (exception) {
            dispatch(setErrorMessage('Could not like blog'))
        }
    }

    const handleDeleteOperation = async (blog) => {
        try {
            if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`))
                return

            dispatch(removeBlog(blog.id))
            dispatch(setNormalMessage(`the blog titled '${blog.title}' by ${blog.author} has been deleted`))
        } catch (exception) {
            dispatch(setErrorMessage('Could not delete blog'))
        }
    }

    const loginForm = () => (
        <Togglable buttonLabel='login'>
            <LoginForm initiateLogin={handleLogin} />
        </Togglable>
    )

    const blogForm = () => (
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={handleBlogCreation} />
        </Togglable>
    )

    return (
        <div>
            <h2>Blogs</h2>
            {user === null
                ?
                <div>
                    <Notification notification={notification} />
                    {loginForm()}
                </div>
                :
                <div>
                    <Notification notification={notification} />
                    <p>{user.name} logged in
                        <button onClick={() => {
                            window.localStorage.removeItem('loggedBlogAppUser')
                            setUser(null)
                        }
                        }>logout
                        </button>
                    </p>
                    {blogForm()}
                    <div id='blog-list'>
                        {blogs.sort((a,b) => b.likes - a.likes)
                            .sort((x,y) => x.title.toLowerCase() - y.title.toLowerCase())
                            .map(blog => <Blog key={blog.id} blog={blog} user={user} likeOperation={handleLikeOperation} deleteOperation={handleDeleteOperation} />)}
                    </div>
                </div>
            }
        </div>
    )
}

export default App