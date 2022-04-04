const express = require('express')
const app = express()

const port = 3010

app.listen(port, () => {
  console.log(`el-juego-backend: listening on ${port}`)
})

app.get('/', (req,res) => {
  res.send('do you believe in life after love?')
})

