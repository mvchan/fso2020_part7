import blogService from '../services/blogs'
import { cloneDeep } from 'lodash'

const reducer = (state = [], action) => {
    console.log('state now: ', state)
    console.log('action', action)

    let blogsCopy

    switch(action.type) {
        case 'INIT_BLOGS':
            return action.data
        case 'CREATE_BLOG':
            return state.concat({...action.data})
        case 'UPDATE_BLOG':
            // deep copy from lodash needed to trigger re-render since modifying the state array will not
            state[state.findIndex(a => a.id === action.data.id)].likes = action.data.likes
            blogsCopy = cloneDeep(state)
            return blogsCopy
        case 'REMOVE_BLOG':
            // deep copy from lodash needed to trigger re-render since modifying the state array will not
            state.splice(state.findIndex(a => a.id === action.data.id),1)
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
            data: {id,...blog}
        })
    }
}

export const removeBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch({
            type: 'REMOVE_BLOG',
            data: id
        })
    }
}

export default reducer