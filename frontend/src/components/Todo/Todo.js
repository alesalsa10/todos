import React, { useState, useRef } from 'react';
import EditForm from '../EditForm/EditForm';
import styled from './Todo.module.css';
const Todo = ({
  handleDelete,
  todoId,
  todoContent,
  onSubmitHandler,
  onChangeHandler,
  inputValue, //this should be the value of the clicked element initially
  initialOnClickHandler,
  completed,
  toggleTodo,
  theme,
}) => {
  const [editMode, setEditingMode] = useState(false);
  const ref = useRef();

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setEditingMode(false);
    }
  };

  const handleEditClick = (e) => {
    initialOnClickHandler(e);
    setEditingMode(true);
  };

  const handleSubmit = (e) => {
    setEditingMode(false);
    onSubmitHandler(e);
  };

  if (editMode) {
    return (
      <EditForm
        ref={ref}
        key={todoId}
        inputValue={inputValue}
        onSubmitHandler={handleSubmit}
        todoId={todoId}
        onChangeHandler={onChangeHandler}
        handleClickOutside={handleClickOutside}
      />
    );
  } else {
    return (
      <div
        className={`${styled.row} ${theme === 'dark' ? styled.darkRow : ''} `}
      >
        <div
          className={`${styled.circle} ${
            completed ? styled.circleCompleted : ''
          }  ${theme === 'dark' ? styled.circleDark : ''} `}
          id={todoId}
          onClick={toggleTodo}
        >
          <span id={todoId} className={styled.check}>
            {completed ? '✓' : ''}
          </span>
        </div>
        <div
          className={`${styled.text} ${completed ? styled.completed : ''}`}
          onClick={handleEditClick}
        >
          {todoContent}
        </div>
        <div className={styled.delete} id={todoId} onClick={handleDelete}>
          <img src='' alt='' />
        </div>
      </div>
    );
  }
};

export default Todo;
