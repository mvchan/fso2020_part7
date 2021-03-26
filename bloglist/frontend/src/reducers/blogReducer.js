import blogService from '../services/blogs'
import { cloneDeep } from 'lodash'

const reducer = (state = [], action) => {
    console.log('blog state now: ', state)
    console.log('blog action: ', action)

    let blogsCopy

    switch(action.type) {
    case 'INIT_BLOGS':
        return action.data
    case 'CREATE_BLOG':
        return state.concat({ ...action.data })
    case 'UPDATE_BLOG':
        // deep copy from lodash needed to trigger re-render since modifying the state array will not
        state[state.findIndex(a => a.id === action.data.id)].likes = action.data.likes
        blogsCopy = cloneDeep(state)
        return blogsCopy
    case 'REMOVE_BLOG':
        // deep copy from lodash needed to trigger re-render since modifying the state array will not
        state.splice(state.findIndex(a => a.id === action.data),1)
        blogsCopy = cloneDeep(state)
        return blogsCopy
    case 'ADD_COMMENT':
        state[state.findIndex(a => a.id === action.data.id)].comments.push(action.data.comment)
        blogsCopy = cloneDeep(state)
        return blogsCopy
    default:
        return state
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs
        })
    }
}

export const setToken = token => {
    return async () => {
        await blogService.setToken(token)
    }
}

export const createNewBlog = blogObject => {
    return async dispatch => {
        const blog = await blogService.create(blogObject)
        dispatch({
            type: 'CREATE_BLOG',
            data: blog
        })
    }
}

export const updateBlog = (id,blogObject) => {
    return async dispatch => {
        const blog = await blogService.update(id,blogObject)
        dispatch({
            type: 'UPDATE_BLOG',
            data: { id, ...blog }
        })
    }
}

export const removeBlog = id => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch({
            type: 'REMOVE_BLOG',
            data: id
        })
    }
}

export const addComment = (id, comment) => {
    return async dispatch => {
        const blog = await blogService.addComment(id,comment)
        dispatch({
            type: 'ADD_COMMENT',
            data: { comment, ...blog }
        })
    }
}

export default reducer