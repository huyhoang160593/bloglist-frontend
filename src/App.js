import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [user, setUser] = useState(null)
  const blogFromRef = useRef()


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
  const handleLogin = async (event) => {
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

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLikeOf = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setMessage(`Blog ${blog.title} was already removed from server`)
        setType('err')
        setTimeout(() => {
          setMessage(null)
          setType(null)
        },4000)
      })
  }

  const handleRemoveOf = (id) => {
    const blog = blogs.find(n => n.id === id)
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      blogService
        .remove(id)
        .then(() => {
          setMessage(`The blog ${blog.title} by ${blog.author} has been removed`)
          setTimeout(() => {
            setMessage(null)
            setType(null)
          },4000)
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          setMessage(`This blog ${blog.title} can't be delete`)
          setType('err')
          setTimeout(() => {
            setMessage(null)
            setType(null)
          },4000)
        })
    }
  }

  const createBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref ={blogFromRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFromRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnBlog => {
        setBlogs(blogs.concat(returnBlog))
        setMessage(`a new blog ${returnBlog.title} by ${returnBlog.author} added`)
        setTimeout(() => {
          setMessage(null)
          setType(null)
        },4000)
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setMessage(`Blog ${blogObject.title} can't be add to server by some reasons`)
        setType('err')
        setTimeout(() => {
          setMessage(null)
          setType(null)
        },4000)
      })
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
              id='username'
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
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
      {createBlogForm()}

      {blogs
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={ () => handleLikeOf(blog.id) }
            handleRemove={ () => handleRemoveOf(blog.id)}
            username={user.username}
          />
        )}
    </div>
  )
}

export default App