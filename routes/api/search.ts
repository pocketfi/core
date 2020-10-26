import {Router} from 'express';
import auth from "../../middleware/auth";
import Transaction from "../../models/Transaction";
import Category from "../../models/Category";
import {ITransaction} from "../../types/interfaces/ITransaction";

const router = Router();

router.post('/bycategory', auth, (req, res) => {
  const {searchText, user} = req.body;

  Category.findOne({$text: {$search: searchText}, user: user.id})
    .then(category => {
      if (category) {
        Transaction.find({category: category._id, user: user.id})
          .then((transactions: ITransaction[]) =>  res.json(transactions))
      } else res.json({msg: "category not found"})
    })
})

router.post('/transaction', auth, (req, res) => {
  const {searchText, user} = req.body;

  Transaction.find({$text: {$search: searchText}, user: user.id})
    .then((transactions: ITransaction[]) => res.json(transactions))
    .catch(e => console.error(e))
})

export default router;
