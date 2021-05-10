const Database = require('sqlite-async')
export const database = async () => await Database.open('./db.sqlite')
