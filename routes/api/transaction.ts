import {Router} from "express";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import auth from "../../middleware/auth";
import User from "../../models/User";
import {CategoryColor} from "../../types/enums/CategoryColor";

const router = Router();

router.post('/new', auth, (req, res) => {
  const {transactionType, category, place, price, currency, user} = req.body;

  User.findById(user.id)
    .then(user => {
      if (!user) res.status(400).json({err: 'user does not exist'});
      return user._id
    }).then(userId => {
    Category.findOne({name: category, user: userId})
      .then(transactionCategory => {
        if (transactionCategory) {
          return transactionCategory._id;
        } else if (category) {
          const enumValues = Object.keys(CategoryColor)
            .map(n => Number.parseInt(n))
          const randomIndex = Math.floor(Math.random() * enumValues.length / 2)
          const randomEnumValue = enumValues[randomIndex]
          return new Category({name: category, user: userId, color: CategoryColor[randomEnumValue].toString()}).save()
            .then(category => {
              return category._id;
            })
        }
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
        res.json(transaction);
      })
    });
  });
});

router.get('/get', auth, ((req, res) => {
  const {user} = req.body;
  var d = new Date(),
    month = d.getMonth(),
    year = d.getFullYear();
  Transaction.find({
    user: user.id,
    created: {$lt: new Date(), $gt: new Date(year, month)}
  }).populate('category').then(transactions => {
    res.json(transactions);
  }).catch(err => {
    console.error(err);
  })
}))

export default router;