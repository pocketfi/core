import {Router} from "express";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import auth from "../../middleware/auth";
import User from "../../models/User";

const router = Router();

router.post('/new', auth, (req, res) => {
  const {transactionType, category, place, price, currency, user} = req.body;

  User.findById(user.id)
    .then(user => {
    if (!user) res.status(400).json({err: 'user does not exist'});
    return user._id
  }).then(userId => {
    Category.findOne({name: category})
      .then(transactionCategory => {
      if (transactionCategory) {
        return transactionCategory._id;
      }
      new Category({name: category, user: userId}).save()
        .then(transactionCategory => {
        return transactionCategory._id;
      })
    }).then(category => {
      const newTransaction = new Transaction({
        user: userId,
        transactionType,
        category,
        place,
        price,
        currency
      });

      newTransaction.save((err, transaction) => {
        if (err) res.status(400).json({err: err});
        console.log(transaction);
        res.json(transaction);
      })
    });
  });
});

export default router;