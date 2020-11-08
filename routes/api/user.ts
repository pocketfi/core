import {Router} from 'express'
import auth from '../../middleware/auth'
import User from '../../models/User'

const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.user.id).select('-password')
    if (!user) throw Error('User Does not exist')
    res.json(user)
  } catch (e) {
    res.status(400).json({msg: e.message})
  }
})

export default router
