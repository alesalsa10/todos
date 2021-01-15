import React, { forwardRef, useEffect } from 'react';
import styled from './EditForm.module.css';

const EditForm = (props, ref) => {
  const {
    onChangeHandler,
    inputValue,
    todoId,
    onSubmitHandler,
    handleClickOutside,
  } = props;

  useEffect(() => {
    // add when mounted
    document.addEventListener('click', handleClickOutside, false);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [handleClickOutside]);

  return (
    <form onSubmit={onSubmitHandler} id={todoId} className={styled.editForm}>
      <input
        ref={ref}
        name='content'
        type='text'
        autoFocus
        maxLength='50'
        onChange={onChangeHandler}
        value={inputValue}
      />
    </form>
  );
};

export default forwardRef(EditForm);
