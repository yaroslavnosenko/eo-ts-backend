import { getAuctions, getOffers } from './data'
import { Database } from 'sqlite3'
const auctions = getAuctions()
const offers = getOffers()

// const getUnique = (arr: any[], col: string) => {
//   const vals = arr.map((row) => row[col])
//   const unique = Array.from(new Set(vals))
//   return unique.sort((b, a) => a - b)
// }

const auctionsNew = auctions
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
    if (newRow['auctionName'] == '') {
      newRow['auctionName'] = undefined
    }
    newRow['comparativePrice'] = parseFloat(
      newRow['comparativePrice'].replace(',', '.')
    )
    newRow['winnerOffer'] = parseFloat(newRow['winnerOffer'].replace(',', '.'))
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

const offersNew = offers.map((row) => {
  const newRow = { ...row }
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

console.log(offersNew[0])

const db = new Database('./db.sql')

db.serialize(function () {
  db.run(`
    CREATE TABLE IF NOT EXISTS auctions (
      auctionUniqueId TEXT PRIMARY KEY,
	  organization TEXT,
      auctionStart INTEGER,
      auctionEnd INTEGER,
      auctionName TEXT,
      auctionVal TEXT,
      comparativePrice REAL,
      winnerOffer REAL,
      currency TEXT,
      invitationsCount INTEGER,
      registeredParticipantsCount INTEGER,
      activeParticipantsCount INTEGER,
      winner TEXT,
      auctionType TEXT,
      category TEXT,
      subcategory TEXT,
      itemsCount INTEGER,
      offerChangesCount INTEGER,
      extensionsCount INTEGER,
      country TEXT,
      percentageReductionMinStep REAL,
      savingComparison REAL
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS offers (
      auctionUniqueId TEXT,
	  organization TEXT,
      roundName TEXT,
      itemId TEXT,
      participant TEXT,
      newValue REAL,
      timestamp INTEGER
    );
  `)

  let stmt = db.prepare(
    'INSERT INTO auctions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )

  auctionsNew.forEach((row) => {
    const enter = Object.entries(row).map((row) => row[1])
    stmt.run(...enter)
  })
  stmt.finalize()

  stmt = db.prepare('INSERT INTO offers VALUES (?, ?, ?, ?, ?, ?, ?)')

  offersNew.forEach((row) => {
    const enter = Object.entries(row).map((row) => row[1])
    stmt.run(...enter)
  })
  stmt.finalize()
})

db.close()
