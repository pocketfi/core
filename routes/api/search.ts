import {Router} from 'express';
import auth from "../../middleware/auth";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import {ITransaction} from "../../types/interfaces/ITransaction";

const router = Router();

router.post('/by-category', auth, (req, res) => {
  const {searchText, user} = req.body;
  let foundTransactions: ITransaction[] = []

  Category.find({name: {$regex: searchText, $options: 'i'}, user: user.id})
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
            .then(transactions => res.json(transactions))
            .catch(err => res.status(400))
        })
      } else res.json({msg: "category not found"})
    })
})

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

export default router;
