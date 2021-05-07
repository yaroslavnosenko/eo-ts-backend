import * as express from 'express'
import { Application, Request, Response } from 'express'
import { dataFrame } from './data'

const app: Application = express()

app.get('/fields', async (req: Request, res: Response) => {
  const data = await dataFrame()
  return res.json(data.listColumns())
})

app.get('/fields/:fieldName/unique', async (req: Request, res: Response) => {
  const { fieldName } = req.params
  const data = await dataFrame()
  const query = JSON.parse(data.unique(fieldName).toJSON())
  return res.json(query[fieldName])
})

app.get('/auctions/:auctionId', async (req: Request, res: Response) => {
  const { auctionId } = req.params
  const data = await dataFrame()
  const query = JSON.parse(
    data.filter((row) => row.get('UniqueID') === auctionId).toJSON()
  )
  console.log(query)
  return res.json(query)
})

app.use('/static', express.static('data'))
app.listen(8080, () => {
  console.log(`server started at http://localhost:8080}`)
})
