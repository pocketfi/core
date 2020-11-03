import {Router} from 'express';
import auth from "../../middleware/auth";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import {ITransaction} from "../../types/interfaces/ITransaction";

const router = Router();

router.post('/transaction', auth, (req, res) => {
  const {searchText, user} = req.body;

  Transaction.find({
    $or: [{
      place: {
        $regex: searchText,
        $options: 'i'
      }
    }, {
      description: {
        $regex: searchText,
        $options: 'i'
      },
    },{
      currency: {
        $regex: searchText,
        $options: 'i'
      }
    }], user: user.id
  })
    .then((transactions: ITransaction[]) => {
      if (transactions.length) {
        res.json(transactions)
      } else res.json({msg: 'transactions not found'})
    })
    .catch(e => console.error(e))
})

router.post('/by-transaction-type', auth, (req, res) => {
  const {transactionType, user} = req.body;

  Transaction.find({transactionType: transactionType, user: user.id})
    .then((transactions: ITransaction[]) => {
      if (transactions.length) {
        res.json(transactions)
      } else res.json({msg: 'transactions not found'})
    })
    .catch(e => console.error(e))
})

router.post('/by-category', auth, (req, res) => {
  const {category, user} = req.body;
  let foundTransactions: ITransaction[] = []

  Category.find({name: category, user: user.id})
    .then(categories => {
      if (categories.length) {
        categories.forEach(category => {
          Transaction.find({category: category._id, user: user.id})
            .then((transactions: ITransaction[]) => {
              if (transactions) {
                transactions.forEach(transaction => {
                  foundTransactions.push(transaction)
                })
              }
              return foundTransactions
            })
            .then(transactions => res.json({transactions, categories}))
            .catch(err => res.status(400))
        })
      } else res.json({msg: "category not found"})
    })
})

router.post('/by-place', auth, (req, res) => {
  const {place, user} = req.body;

  Transaction.find({place: {$regex: place, $options: 'i'}, user: user.id})
    .then((transactions: ITransaction[]) => {
      if (transactions.length) {
        res.json(transactions)
      } else res.json({msg: 'transactions not found'})
    })
    .catch(e => console.error(e))
})

router.post('/by-date', auth, (req, res) => {
  const {start, end, user} = req.body;

  Transaction.find({created: { $lt: end, $gt: start }, user: user.id})
    .then((transactions: ITransaction[]) => {
      if (transactions.length) {
        res.json(transactions)
      } else res.json({msg: 'transactions not found'})
    })
    .catch(e => console.error(e))
})

export default router;
