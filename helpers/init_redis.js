const redis = require('redis')

const redisclient = redis.createClient()

redisclient.on('connect', () => {
    console.log('Client connected to redis...')
})

redisclient.on('ready', () => {
    console.log('Client connected to redis and ready to use...')
})

redisclient.on('error', (err) => {
    console.log(err.message)
})

redisclient.on('end', () => {
    console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
  redisclient.quit()
})

module.exports = redisclient
