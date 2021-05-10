import { parse } from 'csv/lib/sync'
import * as fs from 'fs'

export const getAuctions = (): any[] => {
  const testData = fs.readFileSync('./data/csv/auctions.csv', {
    encoding: 'utf8',
    flag: 'r',
  })
  let data = parse(testData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    trim: true,
  })

  data = data
    .map((row) => {
      const newRow = { ...row }
      let [date, time] = newRow['auctionStart'].split(' ')
      date = date.split('.')
      time = time.split(':')
      newRow['auctionStart'] = Date.UTC(
        date[2],
        date[1] - 1,
        date[0],
        time[0],
        time[1]
      )
      return newRow
    })
    .map((row) => {
      const newRow = { ...row }
      if (newRow['auctionEnd'] === '0') {
        newRow['auctionEnd'] = undefined
        return newRow
      }
      let [date, time] = newRow['auctionEnd'].split(' ')
      date = date.split('.')
      time = time.split(':')
      newRow['auctionEnd'] = Date.UTC(
        date[2],
        date[1] - 1,
        date[0],
        time[0],
        time[1]
      )
      return newRow
    })
    .map((row) => {
      const newRow = { ...row }
      delete newRow['auctionNo']
      delete newRow['auctionId']
      if (newRow['auctionName'] == '') {
        newRow['auctionName'] = undefined
      }
      newRow['comparativePrice'] = parseFloat(
        newRow['comparativePrice'].replace(',', '.')
      )
      newRow['winnerOffer'] = parseFloat(
        newRow['winnerOffer'].replace(',', '.')
      )
      newRow['invitationsCount'] = parseInt(newRow['invitationsCount'])
      newRow['registeredParticipantsCount'] = parseInt(
        newRow['registeredParticipantsCount']
      )
      newRow['activeParticipantsCount'] = parseInt(
        newRow['activeParticipantsCount']
      )
      if (newRow['winner'] == '0') {
        newRow['winner'] = undefined
      }
      newRow['itemsCount'] = parseInt(newRow['itemsCount'])
      newRow['offerChangesCount'] = parseInt(newRow['offerChangesCount'])
      newRow['extensionsCount'] = parseInt(newRow['extensionsCount'])
      // country
      if (
        newRow['country'] === 'Rzeczpospolita Polska' ||
        newRow['country'] === 'Polska'
      ) {
        newRow['country'] = 'PL'
      }
      if (newRow['country'] === 'Česká republika') {
        newRow['country'] = 'CZ'
      }
      if (newRow['country'].length > 2) {
        newRow['country'] = 'SK'
      }
      if (newRow['country'] === '') {
        newRow['country'] = undefined
      }
      newRow['percentageReductionMinStep'] = parseFloat(
        newRow['percentageReductionMinStep'].replace(',', '.')
      )
      newRow['savingComparison'] = parseFloat(
        newRow['savingComparison'].replace(',', '.')
      )
      return newRow
    })
  return data
}

export const getOffers = (): any[] => {
  const testData = fs.readFileSync('./data/csv/offers.csv', {
    encoding: 'utf8',
    flag: 'r',
  })
  let data = parse(testData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';',
    trim: true,
  })

  // CLEANING
  data = data.map((row) => {
    const newRow = { ...row }
    delete newRow['auctionId']
    if (newRow['roundName'] === '' || newRow['roundName'] === 'NA') {
      newRow['roundName'] = undefined
    }
    const date = newRow['date'].split('.')
    const time = newRow['time'].split(':')
    newRow['timestamp'] = Date.UTC(
      date[2],
      date[1] - 1,
      date[0],
      time[0],
      time[1],
      time[2]
    )
    delete newRow['date']
    delete newRow['time']
    newRow['newValue'] = parseFloat(newRow['newValue'].replace(',', '.'))
    return newRow
  })
  return data
}
