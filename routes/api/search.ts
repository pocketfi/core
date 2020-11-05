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


export default router;
