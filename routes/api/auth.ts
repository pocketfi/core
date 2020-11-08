import {Router} from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User'
import {google} from 'googleapis'
import {generateToken} from '../../utils/generateToken'

const router = Router()

router.post('/', (req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    return res.status(400).json({msg: 'Please enter all fields'})
  }

  User.findOne({email}).then(user => {
    if (!user) return res.status(400).json({msg: 'User does not exist'})

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({msg: 'Invalid credentials'})
      const token = generateToken(user.id)
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    })
  })
})

router.post('/google', (req, resp) => {
  const access_token = req.body.access_token
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({access_token: access_token})
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  })
  oauth2.userinfo.get((err, res) => {
    if (err) {
      return resp.status(400)
    } else {
      const {email, name} = res.data
      User.findOne({email}).then(user => {

        if (!user) {
          user = new User({
            name: name,
            email: email
          })
          user.save()
        }

        const token = generateToken(user.id)
        resp.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        })
      })
    }
  })
})

export default router
