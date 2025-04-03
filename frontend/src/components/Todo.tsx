import React, { useState } from 'react';

interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const Todo: React.FC<TodoProps> = ({ id, text, completed, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => {
    if (isEditing && editText.trim() !== text) {
      onEdit(id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(text);
    }
  };

  const handleClick = () => {
    if (!completed) {
      setIsEditing(true);
    }
  };

  return (
    <div className="todo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEdit}
          autoFocus
          style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      ) : (
        <span 
          onClick={handleClick}
          style={{ 
            textDecoration: completed ? 'line-through' : 'none', 
            flex: 1,
            cursor: completed ? 'default' : 'pointer'
          }}
        >
          {text}
        </span>
      )}
      <button 
        onClick={() => onDelete(id)}
        style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Delete
      </button>
    </div>
  );
};

export default Todo; 