import { Router, Request, Response } from 'express'
import { database } from '../database'
const router = Router()

router.get('/stats', async (req: Request, res: Response) => {
  const db = await database()
  const auctionStats = await db.get(
    `SELECT
      COUNT(DISTINCT auctionUniqueId) as auctions,
      COUNT(DISTINCT organization) as organizations
    FROM auctions`
  )
  const savings = await db.get(
    'SELECT AVG(savingComparison) AS avgSavings FROM auctions WHERE savingComparison != 0 AND savingComparison != 1'
  )
  const participants = await db.get(
    'SELECT COUNT(DISTINCT participant) AS participants FROM offers'
  )
  return res.json({ ...auctionStats, ...savings, ...participants })
})

router.get('/stats/category/:category', async (req: Request, res: Response) => {
  const db = await database()
  const { category } = req.params
  const auctionStats = await db.get(
    `SELECT 
      COUNT(DISTINCT auctionUniqueId) as auctions,
      COUNT(DISTINCT organization) as organizations
    FROM auctions
    WHERE category = ?`,
    category
  )
  const savings = await db.get(
    `SELECT 
      AVG(savingComparison) AS avgSavings
    FROM auctions WHERE savingComparison != 0 AND savingComparison != 1 AND category = ?`,
    category
  )
  const participants = await db.get(
    `SELECT
      COUNT(DISTINCT participant) AS participants
    FROM offers 
    WHERE auctionUniqueId IN (SELECT auctionUniqueId FROM auctions WHERE category = ?)`,
    category
  )
  return res.json({ ...auctionStats, ...savings, ...participants })
})

router.get(
  '/stats/subcategory/:category',
  async (req: Request, res: Response) => {
    const db = await database()
    const { category } = req.params
    const auctionStats = await db.get(
      `SELECT 
        COUNT(DISTINCT auctionUniqueId) as auctions,
        COUNT(DISTINCT organization) as organizations
      FROM auctions
      WHERE subcategory = ?`,
      category
    )
    const savings = await db.get(
      `SELECT 
        AVG(savingComparison) AS avgSavings
      FROM auctions WHERE savingComparison != 0 AND savingComparison != 1 AND subcategory = ?`,
      category
    )
    const participants = await db.get(
      `SELECT
        COUNT(DISTINCT participant) AS participants
      FROM offers 
      WHERE auctionUniqueId IN (SELECT auctionUniqueId FROM auctions WHERE subcategory = ?)`,
      category
    )
    return res.json({ ...auctionStats, ...savings, ...participants })
  }
)

export const global = router
