import React from 'react'

const Notification = ({ notification }) => {

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

    return (
        <>
            {notification.message ?
                <div className="error" style={ notification.type === 'ERROR' ? errorStyle : normalStyle}>
                    {notification.message}
                </div>
                : null
            }
        </>
    )
}

export default Notification