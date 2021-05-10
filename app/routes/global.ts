import { Router, Request, Response } from 'express'
const Database = require('sqlite-async')
const router = Router()

// router.get('/categories', async (req: Request, res: Response) => {
//   const db = await Database.open('./db.sql')
//   const row = await db.get(
//     'SELECT AVG(savingComparison) AS "avg" FROM "auctions" WHERE savingComparison != 0 AND savingComparison != 1'
//   )
//   return res.json(row)
// })

// router.get(
//   '/savings/category/:category',
//   async (req: Request, res: Response) => {
//     const { category } = req.params
//     const db = await Database.open('./db.sql')
//     const row = await db.get(
//       'SELECT AVG(savingComparison) AS "avg" FROM "auctions" WHERE savingComparison != 0 AND savingComparison != 1 AND category = ?',
//       category
//     )
//     return res.json(row)
//   }
// )

// router.get(
//   '/savings/subcategory/:subcat',
//   async (req: Request, res: Response) => {
//     const { subcat } = req.params
//     const db = await Database.open('./db.sql')
//     const row = await db.get(
//       'SELECT AVG(savingComparison) AS "avg" FROM "auctions" WHERE savingComparison != 0 AND savingComparison != 1 AND subcategory = ?',
//       subcat
//     )
//     return res.json(row)
//   }
// )

export const global = router
