import {Router} from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import {tokenGeneration} from "../../utils/tokenGeneration";

const router = Router();

router.post('/', (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'});
  }

  User.findOne({email}).then(user => {
    if (user)
      return res.status(400).json({msg: 'User already exists'});

    const newUser = new User({
      name,
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user => {
            const token = tokenGeneration(user.id)
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                });
          }).catch(err => {
          res.status(400).json({err: err});
        });
      });
    });
  });
});

export default router;
