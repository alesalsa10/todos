import React, { forwardRef, useEffect } from 'react';
import styled from './EditForm.module.css';

const EditForm = (props, ref) => {
  const {
    onChangeHandler,
    inputValue,
    todoId,
    handleClickOutside,
    onSubmitHandler,
    theme
  } = props;

  useEffect(() => {
    // add when mounted
    document.addEventListener('click', handleClickOutside, false);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [handleClickOutside]);

  const handleFocus = e => {
    let val = e.target.value;
    e.target.value = '';
    e.target.value = val;
  }

  return (
    <form className={styled.editForm}>
      <textarea
        ref={ref}
        name='content'
        onFocus={handleFocus}
        className={`${styled.EditTextArea}  ${theme === 'dark' ? styled.dark: styled.light} `}
        onChange={onChangeHandler}
        value={inputValue}
        id={`${todoId} `}
        onKeyDown={onSubmitHandler}
        autoFocus
      >
        </textarea>
    </form>
  );
};

export default forwardRef(EditForm);
