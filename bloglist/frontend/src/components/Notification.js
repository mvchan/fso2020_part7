import React from 'react'

const Notification = ({ message, isError }) => {

    const normalStyle =  {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const errorStyle =  {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null || '') {
        return null
    }

    return (
        <div className="error" style={ isError ? errorStyle : normalStyle}>
            {message}
        </div>
    )
}

export default Notification