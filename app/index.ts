import * as express from 'express'
import { Application } from 'express'
import {
  auctions,
  global,
  categories,
  organizations,
  participants,
} from './routes'

const app: Application = express()

app.use(global)
app.use(categories)
app.use(auctions)
app.use(organizations)
app.use(participants)

app.listen(8080, () => {
  console.log(`server started at http://localhost:8080}`)
})
