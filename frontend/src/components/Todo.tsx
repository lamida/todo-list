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
    if (isEditing) {
      onEdit(id, editText);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(text);
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
        <span style={{ textDecoration: completed ? 'line-through' : 'none', flex: 1 }}>
          {text}
        </span>
      )}
      <button 
        onClick={handleEdit}
        style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
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