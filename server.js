/**
 * Main server module
 * @requires body-parser
 * @requires express
 * @requires fs
 * @requires http
 * @requires path
 */

const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const http = require('http')
const path = require('path')

let app = express()
let router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'app', 'public')))

// Loop through routes directory and add routes to router
fs.readdir(path.join(__dirname, 'app', 'api', 'routes'), (err, contents) => {
  if (err) {
    console.error('Error reading routes directory')
    return process.exit(1)
  }

  contents
    .filter(content =>
      fs
        .lstatSync(path.join(__dirname, 'app', 'api', 'routes', content))
        .isDirectory()
    )
    .forEach(folder => {
      try {
        require(path.join(__dirname, 'app', 'api', 'routes', folder))(router)
      } catch (e) {
        console.error(`Error adding routes for ${folder}`)
      }
    })
})

app.use('/api', router)

let server = http.createServer(app)
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
})
