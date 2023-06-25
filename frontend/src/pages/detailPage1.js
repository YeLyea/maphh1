import React, { useState } from 'react'
import './style.css'

function DetailsPage () {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('Initial content')
  const [editContent, setEditContent] = useState(content)

  const handleEditClick = () => {
    setIsEditing(true)
    setEditContent(content)
  }

  const handleSaveClick = () => {
    // 将编辑的内容保存到数据库或其他存储方式
    setIsEditing(false)
    setContent(editContent)
  }

  const handleContentChange = (event) => {
    setEditContent(event.target.value)
  }

  return (
    <div className="details-page">
      <div className="header">
        <h1 className="title">Page Title</h1>
        <button className="edit-button" onClick={handleEditClick}>
          Edit
        </button>
      </div>
      <div className="content-container">
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">Section 1</li>
            <li className="sidebar-menu-item">Section 2</li>
            <li className="sidebar-menu-item">Section 3</li>
            {/* 添加更多的目录项 */}
          </ul>
        </div>
        <div className="content">
          {isEditing ? (
            <textarea
              className="edit-textarea"
              value={editContent}
              onChange={handleContentChange}
            />
          ) : (
            <div className="view-content">{content}</div>
          )}
          {isEditing && (
            <button className="save-button" onClick={handleSaveClick}>
              Save
            </button>
          )}
        </div>
      </div>
      <div className="footer">
        <p>Page Footer</p>
      </div>
    </div>
  )
}

export default DetailsPage
