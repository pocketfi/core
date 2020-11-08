import {Router} from 'express';
import auth from "../../middleware/auth";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import {ITransaction} from "../../types/interfaces/ITransaction";

const router = Router();

router.post('/transaction', auth, (req, res) => {
  const {searchText, transactionType, category, place, dateRange, user, page, size, sort} = req.body

  Category.findOne({name: category, user: user.id})
    .then(category => {
      Transaction.find({
        $and: [{
          $or: [
            {place: {$regex: searchText ? searchText : '', $options: 'i'}},
            {description: {$regex: searchText ? searchText : '', $options: 'i'},},
            {currency: {$regex: searchText ? searchText : '', $options: 'i'}}
          ],
        },
          {transactionType: transactionType ? transactionType : {$exists: true}},
          {place: place ? place : {$exists: true}},
          {created: dateRange ? {$lt: dateRange.end, $gt: dateRange.start} : {$exists: true}},
          {category: category ? category.id : {$exists: true}}
        ], user: user.id
      }).skip(page > 0 ? ((page - 1) * size) : 0)
        .limit(size)
        .sort(sort)
        .then((transactions: ITransaction[]) => {
          if (transactions.length) {
            res.json(transactions)
          } else res.json({msg: 'transactions not found'})
        }).catch(e => console.error(e))
    })
})

router.post('/place', auth, (req, res) => {
  const {place, user} = req.body;

  Transaction.find({place: {$regex: place, $options: 'i'}, user: user.id})
    .then((transactions: ITransaction[]) => {
      if (transactions.length) {
        let places = transactions.map(t => t.place)
        res.json(places)
      } else res.status(400)
    }).catch(e => console.error(e))
})

router.post('/category', auth, (req, res) => {
  const {category, user} = req.body;

  Category.find({name: {$regex: category, $options: 'i'}, user: user.id})
    .then(categories => {
      if (categories.length) {
        res.json(categories)
      } else res.json({msg: "category not found"})
    })
})

export default router;
