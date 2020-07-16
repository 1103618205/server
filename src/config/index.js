import path from 'path'
const DB_URL = 'mongodb://test:123456@39.107.243.53:27017/testdb'
const REDIS = {
  host: 'localhost',
  port: 6379
  // password: '123456'
}
const JWT_SECRET = 'a&*38QthAKuiRwISGLotgq^3%^$zvA3A6Hfr8MF$jM*HY4*dWcwAW&9NGp7*b53!'
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://www.toimic.com' : 'http://localhost:3000'
const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname), '../../public/img')
export default {
  DB_URL,
  REDIS,
  uploadPath,
  baseUrl,
  JWT_SECRET
}
