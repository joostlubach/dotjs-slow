const Express = require('express')
const FS = require('fs')

const app = Express()
app.use(Express.static('./public'))
app.get('*', async (request, response) => {
  FS.readFile('./public/index.html', 'utf8', (error, data) => {
    response.header('Content-Type', 'text/html')
    response.write(data)
    response.end()
  })
})
app.listen(3000)