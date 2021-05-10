import { getAuctions, getOffers } from './data'
const Database = require('sqlite-async')

async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const createDB = async () => {
  console.log('PREPARING AUCTIONS...')
  const auctions = getAuctions()

  console.log('PREPARING OFFERS...')
  const offers = getOffers()

  console.log('CREATING DB...')
  const db = await Database.open('./new.sqlite')
  await db.run(
    `CREATE TABLE IF NOT EXISTS auctions (
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
      savingComparison REAL );`
  )
  await db.run(
    `CREATE TABLE IF NOT EXISTS offers (
      auctionUniqueId TEXT,
	  organization TEXT,
      roundName TEXT,
      itemId TEXT,
      participant TEXT,
      newValue REAL,
      timestamp INTEGER
    );`
  )

  console.log('INSERTING AUCTIONS...')
  let enter = auctions.map((row) => Object.entries(row).map((row) => row[1]))
  await asyncForEach(enter, async (row) => {
    await db.run(
      'INSERT INTO auctions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      row
    )
  })

  console.log('INSERTING OFFERS...')
  enter = offers.map((row) => Object.entries(row).map((row) => row[1]))
  await asyncForEach(enter, async (row) => {
    await db.run('INSERT INTO offers VALUES (?,?,?,?,?,?,?)', row)
  })
  console.log('READY!')
}

createDB()
