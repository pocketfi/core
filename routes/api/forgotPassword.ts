import {Router} from 'express';
import User from '../../models/User';
import {generateToken} from "../../utils/generateToken";
import nodemailer, {SentMessageInfo} from 'nodemailer'

const router = Router();
import config from './../../config'

const {EMAIL_ADDRESS, EMAIL_PASSWORD, HOST, CLIENT_PORT} = config

router.post('/', (req, res) => {
  const {email} = req.body;

  if (!email || email === '') {
    res.status(400).send('email required');
  }

  User.findOne({email}).then(user => {
    if (!user) return res.status(400).json({msg: 'email not in database'});
    const token = generateToken(user.id);
    User.findOneAndUpdate({"_id": user.id}, {
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000)
    }, {new: true}).then(user => {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_ADDRESS,
          pass: EMAIL_PASSWORD
        }
      })

      const mailOptions = {
        from: EMAIL_ADDRESS,
        to: user.email,
        subject: 'Link to reset password',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
          `http://${HOST}:${CLIENT_PORT}/reset/${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      console.log('sending mail');

      transporter.sendMail(mailOptions, (err: Error, response: SentMessageInfo) => {
        if (err) console.error(err)
        else res.status(200).json('email sent');
      })
    })
  })
})

export default router;
