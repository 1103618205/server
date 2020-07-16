import { getValue } from '@/config/RedisConfig'
import config from '@/config/index'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
const getJWTPayload = token => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
const getStats = (path) => {
  return new Promise((resolve) => {
    fs.stat(path, (err, stats) => err ? resolve(false) : resolve(stats))
  }
  )
}
const mkdir = (dir) => {
  return new Promise((resolve) => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}
const dirExists = async (dir) => {
  const isExists = await getStats(dir)
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    return false
  }
  const tempDir = path.parse(dir).dir
  const status = await dirExists(tempDir)
  if (status) {
    const result = await mkdir(dir)
    return result
  } else {
    return false
  }
  // const tempDir = path.parse(dir).dir
}
export {
  checkCode,
  getStats,
  dirExists,
  getJWTPayload
}
