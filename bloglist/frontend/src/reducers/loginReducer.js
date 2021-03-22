const reducer = (state = null, action) => {
    console.log('login state now: ', state)
    console.log('login action: ', action)

    switch (action.type) {
    case 'SET_LOGIN':
        return action.data
    default:
        return state
    }
}

export const setLogin = user => {
    return {
        type: 'SET_LOGIN',
        data: user
    }
}

export default reducer