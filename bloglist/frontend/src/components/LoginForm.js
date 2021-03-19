import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ initiateLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('logging in as ', username)
        initiateLogin({
            username,
            password
        })
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h3>log in to the application</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input id='username' type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    password
                    <input id='password' type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button id='login-button' type="submit">login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    initiateLogin: PropTypes.func.isRequired
}

export default LoginForm