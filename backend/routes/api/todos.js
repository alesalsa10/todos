const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Todo = require('../../models/Todo');

//POST api/todos/new
//create todo
//private route
router.post(
  '/new',
  auth,
  [check('content', 'Content is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const createdTodo = new Todo({
        content: req.body.content,
        creator: req.user.id,
      });

      await createdTodo.save();
      await user.todos.push(createdTodo);
      await user.save();
      res.status(201).json(createdTodo);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//get api/todos/
//get all todos
//private (only todos owner gets to see them)

router.get('/', auth, async (req, res) => {
  try {
    const userTodos = await User.findById(req.user.id)
      .select('-password')
      .lean()
      .populate('todos', ['content', 'completed']);

    if (!userTodos) {
      return res.status(400).send('Server error');
    }

    return res.status(200).json(userTodos);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Todos not found' });
    }

    return res.status(500).send('Server error');
  }
});

//delete api/todos/:id
//private(only the person that created the todos can delete it)
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (todo === null) {
      return res.status(404).json({ msg: 'Cannot delete todo' });
    }
    //check user
    if (todo.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await todo.remove();
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Todo not found' });
    }
    return res.status(500).send('Server error');
  }
});

//delte all completed todos
router.delete('/delete/completed', auth, async (req, res) => {
  try {
    const todos = await User.findById(req.user.id);

    todos.todos.map(async (todoId) => {
      try {
        let todo = await Todo.findById(todoId);
        if (todo.completed) {
          todo.remove();
        }
      } catch (e) {
        console.log(e);
      }
    });

    return res.json({ msg: 'All completed removed' });
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'Something went wrong, try again' });
  }
});

//update api/todos/:id
//private(ony the creator of the todo can update)
router.put(
  '/:id',
  auth,
  [check('content', 'Content is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await Todo.findByIdAndUpdate(
        req.params.id,
        { content: req.body.content },
        { new: true },
        function (err, result) {
          if (err) {
            console.log(err);
          }
          console.log(result);
          res.send(result);
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//update api/todos/complete/:id
//mark todo as completed
router.put('/complete/:id', auth, async (req, res) => {
  try {
    await Todo.findOne({ _id: req.params.id }, function (err, todo) {
      todo.completed = !todo.completed;
      todo.save(function (err, updatedTodo) {
        if (err) {
          console.log(err);
        }
        console.log(updatedTodo);
        res.send(updatedTodo);
      });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
