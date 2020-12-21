import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/auth-context';
import Todo from '../Todo/Todo';
import styled from './Todos.module.css';

export default function Todos() {
  const [loadedTodos, setLoadedTodos] = useState([]);
  const auth = useContext(AuthContext);
  const [content, setContent] = useState({
    content: '',
  });
  const [updatedContent, setUpdatedContent] = useState({ content: '' });
  const [trigger, setTrigger] = useState(false);
  const [todosType, setTodosType] = useState('All');
  const [todosLeft, setTodosLeft] = useState(0);

  const handleTodosTypeClick = (e) => {
    setTodosType(e.target.id);
  };

  const handleTodoInput = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleTodoClick = (e) => {
    setUpdatedContent({
      ...updatedContent,
      content: e.target.parentNode.childNodes[1].outerText,
    });
  };

  const handleTodoUpdate = (e) => {
    setUpdatedContent({ ...updatedContent, [e.target.name]: e.target.value });
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/todos/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': auth.token.token,
        },
        body: JSON.stringify({
          content: content.content,
        }),
      });
      const responseData = await response.json();
      setTrigger(!trigger);
      setContent({ content: '' });
      if (!response.ok) {
        throw new Error(responseData.errors[0].msg.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/${e.target.id}`,
        {
          method: 'DELETE',
          headers: {
            'x-auth-token': auth.token.token,
          },
        }
      );
      const responseData = await response.json();
      setTrigger(!trigger);
      if (!response.ok) {
        throw new Error(responseData.errors[0].msg.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/${e.target.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': auth.token.token,
          },
          body: JSON.stringify({
            content: updatedContent.content,
          }),
        }
      );
      const responseData = await response.json();
      setTrigger(!trigger);
      if (!response.ok) {
        throw new Error(responseData.errors[0].msg.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/complete/${e.target.id}`,
        {
          method: 'PUT',
          headers: {
            'x-auth-token': auth.token.token,
          },
        }
      );
      const responseData = await response.json();
      setTrigger(!trigger);
      if (!response.ok) {
        throw new Error(responseData.errors[0].msg.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearCompleted = async e => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/todos/delete/completed`,
        {
          method: 'DELETE',
          headers: {
            'x-auth-token': auth.token.token,
          },
        }
      );
      const responseData = await response.json();
      setTrigger(!trigger);
      if (!response.ok) {
        throw new Error(responseData.errors[0].msg.toString());
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const sendRequest = async (token) => {
      const res = await fetch('http://localhost:5000/api/todos', {
        headers: {
          'x-auth-token': token,
        },
      });

      const resData = await res.json();

      setTodosLeft(resData.todos.filter((todo) => !todo.completed).length);

      if (todosType === 'All') {
        setLoadedTodos(resData.todos);
      } else if (todosType === 'Completed') {
        setLoadedTodos(resData.todos.filter((todo) => todo.completed));
      } else if (todosType === 'Active') {
        setLoadedTodos(resData.todos.filter((todo) => !todo.completed));
      }
    };
    sendRequest(auth.token.token);
  }, [trigger, auth.token.token, todosType, todosLeft]); //update whenever content changes

  //new
  return (
    <div className={styled.mainContainer}>
      <div className={styled.container}>
        <div className={styled.header}>
          <div className={styled.title}>TODO</div>
          <div className={styled.icon}>
            <div></div>
          </div>
        </div>
        <div className={styled.input}>
          <form onSubmit={addTodo}>
            <input
              type='text'
              placeholder='Add a new todo'
              onChange={handleTodoInput}
              value={content.content}
              name='content'
            />
          </form>
        </div>
        {loadedTodos !== undefined ? (
          <div>
            <div className={styled.items}>
              {loadedTodos.map((todo) => (
                <Todo
                  key={todo._id}
                  handleDelete={deleteTodo}
                  todoId={todo._id}
                  todoContent={todo.content}
                  completed={todo.completed}
                  onSubmitHandler={updateTodo}
                  onChangeHandler={handleTodoUpdate}
                  inputValue={updatedContent.content}
                  initialOnClickHandler={handleTodoClick}
                  toggleTodo={toggleTodo}
                />
              ))}

              <div className={styled.footer}>
                <div className={styled.todosLeft}>{todosLeft} items left</div>
                <div
                  className={`${todosType === 'All' ? styled.selected : ''} ${
                    styled.buttons
                  }`}
                  id='All'
                  onClick={handleTodosTypeClick}
                >
                  All
                </div>
                <div
                  className={`${
                    todosType === 'Active' ? styled.selected : ''
                  } ${styled.buttons}`}
                  id='Active'
                  onClick={handleTodosTypeClick}
                >
                  Active
                </div>
                <div
                  className={`${
                    todosType === 'Completed' ? styled.selected : ''
                  } ${styled.buttons}`}
                  id='Completed'
                  onClick={handleTodosTypeClick}
                >
                  Completed
                </div>
                <div className={styled.clearCompleted} onClick={clearCompleted} >Clear Completed</div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
