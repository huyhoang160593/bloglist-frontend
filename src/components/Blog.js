import React,{ useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, handleLike, handleRemove, username }) => {
  const [visible,setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const isThisBlogDontHaveUser = blog.user === undefined
  const blogUserName = isThisBlogDontHaveUser ? 'Unknown' : blog.user.name
  const checkUserPermission = isThisBlogDontHaveUser ? false : blog.user.username === username

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div className="generalInfo">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className="detailInfoHidden">
        <div>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        </div>
        <div>
          likes <span className="likeCount">{blog.likes}</span>
          <button onClick={handleLike}>like</button>
        </div>
        <div>
          {blogUserName}
        </div>
        <div>
          {checkUserPermission && <button onClick={handleRemove}>remove</button>}
        </div>
      </div>
    </div>
  )
}



export default Blog
