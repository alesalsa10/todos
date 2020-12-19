const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

//get api/auth
//private route
//if user is found it is returned else error
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//post api/auth
//Authenticate user and get token (Sign in which needs a post to get token)
//public route
router.post(
    '/',
    [
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Password is required'
      ).exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email });
  
        //check if user exists
        if (!user) {
          //using this errors format so we keep the same as above erros.array()
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        //compare plain text password with hashed
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        //return jsonwebtoken
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        //token to be sent in the header to access authenticated routes
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          //{ expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

module.exports = router;
