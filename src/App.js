import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState(null)
  const [type, setType] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])
  const handleLogin = async (event) =>{
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,password,
      })
      window.localStorage.setItem('loggedBlogappUser',JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setMessage('wrong username or password')
      setType('err')
      setTimeout(() => {
        setMessage(null)
        setType(null)
      },4000)
    }
  }

  const handleLogout = (event) =>{
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreate = async (event) =>{
    event.preventDefault()
    try {
      const blog = await blogService.create({
        title,author,url
      })
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(blog))
      setMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage(null)
        setType(null)
      },4000)
    } catch (error) {
      console.log(error)
    }
  }

  if(user === null) {
    return(
      <div>
        <h2>log in to application</h2>
        <Notification message= {message} type={type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
                type="password"
                value={password}
                name="password"
                onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message= {message} type={type} />
      <p>{user.name} has logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <form onSubmit={handleCreate}>
        <div>
            title
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
            author
              <input
                type="text"
                value={author}
                name="author"
                onChange={({ target }) => setAuthor(target.value)}
              />
        </div>
        <div>
            url
              <input
                type="text"
                value={url}
                name="url"
                onChange={({ target }) => setUrl(target.value)}
              />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App