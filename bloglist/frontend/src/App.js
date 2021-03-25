import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { createNewBlog, initializeBlogs, removeBlog, updateBlog, setToken } from './reducers/blogReducer'
import { setNormalMessage, setErrorMessage } from './reducers/notificationReducer'
import { setLogin } from './reducers/loginReducer'
import { initializeUsers } from './reducers/usersReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
    Switch, Route, Link,
    useRouteMatch,
    useHistory
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@material-ui/core'

const App = () => {

    const blogs = useSelector(state => state.blogs)
    const notification = useSelector(state => state.notification)
    const login = useSelector(state => state.login)
    const users = useSelector(state => state.users)

    const blogFormRef = useRef()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
        dispatch(initializeUsers())

        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setLogin(user))
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
            dispatch(setLogin(user))
            dispatch(setNormalMessage(`${user.name} successfully logged in!`))
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
            history.push('/')
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

    const userMatch = useRouteMatch('/users/:id')
    const user = userMatch ? users.find(user => user.id === userMatch.params.id) : null

    const blogMatch = useRouteMatch('/blogs/:id')
    const blog = blogMatch ? blogs.find(user => user.id === blogMatch.params.id) : null

    const Navigation = () => (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" component={Link} to="/">
                blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                users
                </Button>
                {login
                    ? <em>{login.name} logged in <button onClick={() => {
                        window.localStorage.removeItem('loggedBlogAppUser')
                        dispatch(setLogin(null))
                    }
                    }>
                    logout
                    </button></em>
                    : null
                }
            </Toolbar>
        </AppBar>
    )

    const Header = () => (
        <div>
            <Notification notification={notification} />
            {!login
                ?
                <div>
                    <h2>Login</h2>
                    {loginForm()}
                </div>
                : null
            }
        </div>
    )

    const AllBlogs = () => {
        const blogStyle = {
            paddingTop: 10,
            paddingLeft: 2,
            border: 'solid',
            borderWidth: 1,
            marginBottom: 5
        }

        return (
            <div>
                {!login
                    ?
                    null
                    :
                    <div>
                        <h2>Blogs</h2>
                        {blogForm()}
                        <div id='blog-list'>
                            {blogs.sort((a,b) => b.likes - a.likes)
                                .sort((x,y) => x.title.toLowerCase() - y.title.toLowerCase())
                                .map(blog => (
                                    <div key={blog.id} style={blogStyle}>
                                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }

    const Users = () => (
        <div>
            {!login
                ?
                null
                :
                <>
                    <h2>Users</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td></td>
                                <td><b>blogs created</b></td>
                            </tr>
                            {users.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase()).map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                                    </td>
                                    <td>
                                        {blogs.filter(blog => blog.user.id === user.id).length}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
        </div>
    )

    // user should be checked as well if null because the data from backend might not have been received yet, or else will return undefined error
    const UserBlogs = () => (
        <div>
            {!login || !user
                ? null
                :
                <>
                    <h2>{user.name}</h2>
                    <h3>added blogs</h3>
                    <ul>
                        {blogs.filter(blog => blog.user.id === user.id).map(blog => (
                            <li key={blog.id}>{blog.title}</li>
                        ))
                        }
                    </ul>
                </>
            }
        </div>
    )

    return (
        <Container>
            <Navigation />
            <Header />
            <Switch>
                <Route path='/users/:id'>
                    <UserBlogs />
                </Route>
                <Route path='/users'>
                    <Users />
                </Route>
                <Route path='/blogs/:id'>
                    <Blog blog={blog} user={login} likeOperation={handleLikeOperation} deleteOperation={handleDeleteOperation} />
                </Route>
                <Route path='/'>
                    <AllBlogs />
                </Route>
            </Switch>
        </Container>
    )
}

export default App