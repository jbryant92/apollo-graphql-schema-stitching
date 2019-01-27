const express = require('express')
const app = express()
const port = 4003

const commentsData = {
  1: [
    { user: 'bob', message: 'this order is having issues' },
    { user: 'sam', message: 'i can take a look' },
    { user: 'bob', message: 'thanks' }
  ],
  2: [
    { user: 'jim', message: 'something is happening here' },
    { user: 'jan', message: 'this is a good order' },
    { user: 'tim', message: 'not cool' }
  ]
}

app.get('/orders/:orderId/comments', function (req, res) {
  res.send(commentsData[req.params.orderId])
})

app.listen(port, () => console.log(`Store server ready at http://localhost:${port}/`))
