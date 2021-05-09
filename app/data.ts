import { parse } from 'csv/lib/sync'
import * as fs from 'fs'

export const getAuctions = (): any[] => {
  const testData = fs.readFileSync('./data/auctions.csv', {
    encoding: 'utf8',
    flag: 'r',
  })
  let data = parse(testData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    trim: true,
  })

  data = data.map((row) => {
    delete row['auctionNo']
    delete row['auctionId']
    return row
  })
  return data
}

export const getOffers = (): any[] => {
  const testData = fs.readFileSync('./data/offers.csv', {
    encoding: 'utf8',
    flag: 'r',
  })
  let data = parse(testData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    trim: true,
  })

  data = data.map((row) => {
    delete row['auctionId']
    return row
  })
  return data
}
