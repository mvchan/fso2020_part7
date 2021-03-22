let timeoutID

const reducer = (state = {}, action) => {
    console.log('notification state now: ', state)
    console.log('notification action: ', action)

    switch (action.type) {
    case 'NORMAL':
        return action
    case 'ERROR':
        return action
    case 'CLEAR_MESSAGE':
        return {}
    default:
        return state
    }
}

export const setNormalMessage = (message) => {
    clearTimeout(timeoutID)
    return async dispatch => {
        await dispatch ({
            type: 'NORMAL',
            message: message
        })
        timeoutID = setTimeout(() => {
            dispatch(clearMessage())
        }, 5000)
    }
}

export const setErrorMessage = (message) => {
    clearTimeout(timeoutID)
    return async dispatch => {
        await dispatch ({
            type: 'ERROR',
            message: message
        })
        timeoutID = setTimeout(() => {
            dispatch(clearMessage())
        }, 5000)
    }
}

export const clearMessage = () => {
    return {
        type: 'CLEAR_MESSAGE'
    }
}

export default reducer