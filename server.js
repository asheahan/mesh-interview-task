/**
 * Main server module
 * @requires body-parser
 * @requires express
 * @requires fs
 * @requires http
 * @requires path
 * @requires swagger-jsdoc
 */

const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const http = require('http')
const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')

let app = express()
let router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'app', 'public')))

let swaggerDefinition = {
  info: {
    title: 'Mesh Interview Task API',
    version: '1.0.0'
  },
  basePath: '/'
}

let options = {
  swaggerDefinition,
  apis: ['./app/api/routes/**/index.js']
}

let swaggerSpec = swaggerJSDoc(options)

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

app.use(router)

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

let server = http.createServer(app)
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
})
