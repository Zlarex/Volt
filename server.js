const express = require('express')
const server = express()

server.all('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.write('Volt - Discord Bot')
  res.end()
})

keepAlive = () => {
  server.listen(3000, () => {
    console.log('Server is ready')
  })
}

module.exports = keepAlive