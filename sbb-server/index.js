const express = require('express')
var cors = require('cors')

const app = express()
const port = 80
app.use(cors())

app.get('/', (req, res) => {
  res.json({
    response:
      [
        {
          text: 'something sbb can do',
          apiEndpoint: 'http://api.sbb.ch/someEndpoint'
        },
        {
          text: 'another thing sbb can do',
          apiEndpoint: 'http://api.sbb.ch/oneMoreEndpoint'
        }
      ]
  })
})

app.get('/someEndpoint', (req, res) => {
  res.json({
    data:
      [
        {
          train: 'S1',
        },
        {
          train: 'S2'
        }
      ]
  })
})

app.get('/oneMoreEndpoint', (req, res) => {
  res.json({
    data:
      [
        {
          platform: '1',
        },
        {
          platform: '2'
        }
      ]
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
