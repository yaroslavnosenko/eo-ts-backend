import { Router, Request, Response } from 'express'
const Database = require('sqlite-async')
const router = Router()

router.get('/auctions/new', async (req: Request, res: Response) => {
  const db = await Database.open('./db.sql')
  const row = await db.all(
    'SELECT * FROM auctions ORDER BY auctionStart DESC LIMIT 15'
  )
  return res.json(row)
})

router.get('/auctions/:auctionId', async (req: Request, res: Response) => {
  const { auctionId } = req.params
  const db = await Database.open('./db.sql')
  const row = await db.get('SELECT * FROM auctions WHERE auctionUniqueId = ?', [
    auctionId,
  ])
  return res.json(row)
})

export const auctions = router
