import {Router} from 'express'
import User from '../../models/User'
import {IUser} from '../../types/interfaces/IUser'
import bcrypt from 'bcryptjs'

const router = Router()

router.get('/reset', (req, res) => {
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken.toString(),
    resetPasswordExpires: {$gt: new Date()}
  }).then((user: IUser) => {
    if (!user) {
      res.json('password reset link is invalid or has expired')
    } else {
      res.status(200).send({
        email: user.email,
        resetLink: true
      })
    }
  })
})

router.put('/updatePassword', (req, res) => {
  const {email} = req.body
  User.findOne({email}).then(user => {
    if (user) {
      bcrypt.genSalt(10).then(salt => {
        bcrypt.hash(req.body.password, salt).then(hash => {
          User.findOneAndUpdate({'_id': user.id}, {
            password: hash,
            resetPasswordToken: null,
            resetPasswordExpires: null
          }, {new: true}).then(user => {
            res.status(200).send({updated: true})
          })
        })
      })
    } else {
      res.status(404).json('no user exists in db to update')
    }
  })
})

export default router


