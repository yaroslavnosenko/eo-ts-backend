import { DataFrame } from 'dataframe-js'

export const dataFrame = async () => {
  const data = await DataFrame.fromText('http://localhost:8080/static/data.csv')
  return data
}
