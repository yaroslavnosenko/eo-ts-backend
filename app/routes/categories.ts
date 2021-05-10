import { Router, Request, Response } from 'express'
import { database } from '../database'
const router = Router()

router.get('/categories', async (req: Request, res: Response) => {
  const db = await database()
  const query = await db.all('SELECT DISTINCT category FROM auctions')
  return res.json(query.map((row) => row['category']))
})

router.get('/categories/:category', async (req: Request, res: Response) => {
  const { category } = req.params
  const db = await database()
  const query = await db.all(
    'SELECT DISTINCT subcategory FROM auctions WHERE category = ?',
    category
  )
  return res.json(query.map((row) => row['subcategory']))
})

export const categories = router
