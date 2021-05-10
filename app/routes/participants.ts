import { Router, Request, Response } from 'express'
import { database } from '../database'
const router = Router()

router.get('/participants', async (req: Request, res: Response) => {
  const db = await database()
  const row = await db.all(
    'SELECT DISTINCT participant FROM offers ORDER BY participant DESC'
  )
  return res.json(row.map((row) => row['participant']))
})

router.get('/participants/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const db = await database()
  const myAuctions = await db.all(
    'SELECT * FROM auctions WHERE auctionUniqueId IN (SELECT DISTINCT auctionUniqueId FROM "offers" WHERE participant = ?)',
    [id]
  )
  return res.json({
    participant: id,
    auctions: myAuctions,
  })
})

export const participants = router
