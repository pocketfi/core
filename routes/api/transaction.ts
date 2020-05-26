import {Router} from "express";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import auth from "../../middleware/auth";
import User from "../../models/User";
import {CategoryColor} from "../../types/enums/CategoryColor";
import socket from '../../webSocketServer'
import {ITransaction} from "../../types/interfaces/ITransaction";
import {ICategory} from "../../types/interfaces/ICategory";

const router = Router();

router.post('/new', auth, (req, res) => {
  const {transaction, user} = req.body;
  User.findById(user.id)
    .then(user => {
      if (!user) res.status(400).json({err: 'user does not exist'});
      return user._id
    }).then(userId => {
    Category.findOne({name: transaction.category, user: userId})
      .then(transactionCategory => {
        if (transactionCategory) {
          return transactionCategory._id;
        } else if (transaction.category) {
          const enumValues = Object.keys(CategoryColor)
            .map(n => Number.parseInt(n))
          const randomIndex = Math.floor(Math.random() * enumValues.length / 2)
          const randomEnumValue = enumValues[randomIndex]
          return new Category({
            name: transaction.category,
            user: userId,
            color: CategoryColor[randomEnumValue].toString()
          }).save()
            .then(category => {
              return category;
            })
        }
      }).then(category => {
      const newTransaction = new Transaction({
        user: userId,
        transactionType: transaction.transactionType,
        category,
        place: transaction.place,
        price: transaction.price,
        currency: transaction.currency
      });

      newTransaction.save().then((transaction: ITransaction) => {
        if (!transaction) res.status(400);
        socket.emit('new', newTransaction);
        res.status(200);
      })
    });
  });
});

router.get('/get', auth, (req, res) => {
  const {user} = req.body;
  var d = new Date(),
    month = d.getMonth(),
    year = d.getFullYear();
  Transaction.find({
    user: user.id,
    created: {$lt: new Date(), $gt: new Date(year, month)}
  }).populate('category').then((transactions: ITransaction[]) => {
    res.json(transactions);
  }).catch((err: any) => {
    console.error(err);
  })
})

router.post('/update', auth, (req, res) => {
  const {transaction, user} = req.body;
  User.findById(user.id).then(user => {
    if (!user) res.status(400).json({err: 'user does not exist'});
  })

  Category.findOne({name: transaction.category.name, user: user.id})
    .then(category => {
      if (category) {
        return category;
      } else if (transaction.category) {
        const enumValues = Object.keys(CategoryColor)
          .map(n => Number.parseInt(n))
        const randomIndex = Math.floor(Math.random() * enumValues.length / 2)
        const randomEnumValue = enumValues[randomIndex]
        return new Category({
          name: transaction.category.name,
          user: user.id,
          color: CategoryColor[randomEnumValue].toString()
        }).save()
          .then(category => {
            return category;
          })
      }
    }).then((category: ICategory) => {

    if (category) {
      category.name = transaction.category.name;
      category.color = transaction.category.color;
    }

    category.save((err: any, category: ICategory) => {
      if (err) res.status(500);

      Transaction.findOneAndUpdate({"_id": transaction.id},
        {
          transactionType: transaction.transactionType,
          category,
          place: transaction.place,
          price: transaction.price,
          currency: transaction.currency,
          created: transaction.created,
          description: transaction.description
        }, {new: true}).then((transaction) => {
        if (transaction) res.status(200).json(transaction)
        else res.status(500)
      });
    })
  })
})


router.delete('/delete/:id', auth, (req, res) => {
  Transaction.findByIdAndRemove(req.params.id, (err: any, transaction: ITransaction) => {
      if (err) res.status(500)
      res.status(200).json(transaction)
    }
  )
})

export default router;