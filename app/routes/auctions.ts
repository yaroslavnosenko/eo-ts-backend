import { Router, Request, Response } from 'express'
import { database } from '../database'
const router = Router()

router.get('/auctions/new', async (req: Request, res: Response) => {
  const db = await database()
  const row = await db.all(
    'SELECT * FROM auctions ORDER BY auctionStart DESC LIMIT 15'
  )
  return res.json(row)
})

router.get('/auctions/q/:name', async (req: Request, res: Response) => {
  const { name } = req.params
  const db = await database()
  const row = await db.all(
    `SELECT * FROM auctions WHERE auctionName LIKE "%${name}%" LIMIT 5`
  )
  return res.json(row)
})

router.get('/auctions/:auctionId', async (req: Request, res: Response) => {
  const { auctionId } = req.params
  const db = await database()
  const row = await db.get('SELECT * FROM auctions WHERE auctionUniqueId = ?', [
    auctionId,
  ])
  const offers = await db.all(
    'SELECT * FROM offers WHERE auctionUniqueId = ?',
    [auctionId]
  )
  return res.json({ ...row, offers: offers })
})

export const auctions = router
