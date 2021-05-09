import * as express from 'express'
import { Application, Request, Response } from 'express'
import { getOffers, getAuctions } from './data'

const app: Application = express()

app.get('/organizations', (req: Request, res: Response) => {
  const auctions = getAuctions()
  const organizations = auctions.map((row) => row['organization'])
  return res.json(Array.from(new Set(organizations)))
})

app.get('/organizations/:orgId', (req: Request, res: Response) => {
  const auctions = getAuctions()
  const { orgId } = req.params
  const myAuctions = auctions.filter((row) => row['organization'] === orgId)
  const wonAuctions = myAuctions.filter((row) => row['winner'] !== '0')
  const jsonRes = {
    organization: orgId,
    allWiners: Array.from(new Set(myAuctions.map((row) => row['winner']))),
    categories: Array.from(new Set(myAuctions.map((row) => row['category']))),
    totalSpending: wonAuctions
      .map((row) => parseFloat(row['winnerOffer'].replace(',', '.')))
      .reduce((a, b) => a + b, 0),
    auctionsCount: myAuctions.length,
    wonAuctionsCount: wonAuctions.length,
    auctions: myAuctions,
  }
  return res.json(jsonRes)
})

app.get('/participants', (req: Request, res: Response) => {
  const offers = getOffers()
  const participants = offers.map((row) => row['participant'])
  return res.json(Array.from(new Set(participants)))
})

app.get('/participants/:partId', (req: Request, res: Response) => {
  const offers = getOffers()
  const auctions = getAuctions()
  const { partId } = req.params
  const myOffers = offers.filter((row) => row['participant'] === partId)
  const myAuctionsIds = Array.from(
    new Set(myOffers.map((row) => row['auctionUniqueId']))
  )
  const myAuctions = auctions.filter((row) =>
    myAuctionsIds.includes(row['auctionUniqueId'])
  )
  const wonAuctions = myAuctions.filter((row) => row['winner'] === partId)
  const jsonRes = {
    participant: partId,
    categories: Array.from(new Set(myAuctions.map((row) => row['category']))),
    totalIncome: wonAuctions
      .map((row) => parseFloat(row['winnerOffer'].replace(',', '.')))
      .reduce((a, b) => a + b, 0),
    auctionsCount: myAuctions.length,
    wonAuctionsCount: wonAuctions.length,
    auctions: myAuctions,
  }
  return res.json(jsonRes)
})

app.listen(8080, () => {
  console.log(`server started at http://localhost:8080}`)
})
