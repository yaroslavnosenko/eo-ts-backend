import { Router, Request, Response } from 'express'
import { database } from '../database'
const router = Router()

router.get('/organizations', async (req: Request, res: Response) => {
  const db = await database()
  const row = await db.all(
    'SELECT DISTINCT organization FROM auctions ORDER BY organization ASC'
  )
  return res.json(row.map((row) => row['organization']))
})

router.get('/organizations/:orgId', async (req: Request, res: Response) => {
  const { orgId } = req.params
  const db = await database()
  const myAuctions = await db.all(
    'SELECT * FROM auctions WHERE organization = ?',
    [orgId]
  )
  return res.json({
    organization: orgId,
    auctions: myAuctions,
  })
})

export const organizations = router
