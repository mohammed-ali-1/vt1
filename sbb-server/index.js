const express = require('express')
var cors = require('cors')

const app = express()
const port = 80
app.use(cors())

app.get('/', (req, res) => {
  console.log('request made')
  res.json({
    response:
      [
        {
          text: 'SBB feature #1',
          apiEndpoint: 'http://api.sbb.ch/someEndpoint'
        },
        {
          text: 'SBB feature #2',
          apiEndpoint: 'http://api.sbb.ch/oneMoreEndpoint'
        }
      ]
  })
})

app.get('/someEndpoint', (req, res) => {
  console.log('/someEndpoint hit')
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
    console.log('/oneMoreEndpoint hit')
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
