import React, { useState } from 'react'
import {
  Switch, Route, Link,
  useRouteMatch,
  useHistory
} from "react-router-dom"
import { useField } from './hooks'

let timeoutID

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <p>has {anecdote.votes} votes</p>
    <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Input = ({type,value,onChange}) => (
  <input type={type} value={value} onChange={onChange} />
)

const CreateNew = (props) => {
  // custom hooks
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  // this is a hook that allows url to change and route to
  // corresponding component in the App's Switch
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!content.value || !author.value || !info.value)
      return
      
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    clearTimeout(timeoutID)
    props.setNotification(`a new anecdote ${content.value} created!`)
    timeoutID = setTimeout(() => props.setNotification(''), 10000)
    history.push('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  // spread operator used for assigning the attributes as props since they have the same name
  // e.g. content is an object with type, value, and onChange properties, which input element uses
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <Input {...content} />
        </div>
        <div>
          author
          <Input {...author} />
        </div>
        <div>
          url for more info
          <Input {...info} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const Notification = (props) => {

  const notification = () => (
    props.notification ? props.notification : null
  )

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  
  if (!notification())
    return null

  return (
    <div style={style}>
      {notification()}
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useRouteMatch('/:id')
  const anecdote = match ? anecdoteById(match.params.id) : null

  // for Switch component, the order of components is important
  // if the path for "/" is first, nothing below it would get rendered
  // because the "/" is the start of every path, so place it at the very end
  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification}/>

      <Switch>
        <Route path="/create">
          <CreateNew addNew={addNew} setNotification={setNotification} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/:id">
          <Anecdote anecdote={anecdote} />
        </Route>
        <Route path="/">
          <AnecdoteList anecdotes={anecdotes} />
        </Route>
      </Switch>   
      
      <Footer />
    </div>
  )
}

export default App;