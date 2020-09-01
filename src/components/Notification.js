import React from 'react'

const Notification = ({ message,type }) => {
  if (message === null) {
    return null
  }
  if(type === null){
    return (
      <div className="notification">
        {message}
      </div>
    )
  }
  return(
    <div className="notification error">
      {message}
    </div>
  )
}

export default Notification