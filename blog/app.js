const express = require('express')
const bodyParser = require('body-parser')
const { log } = require('./utils')

const app = express()

app.use(express.static('static'))
app.use(bodyParser.json())

const registerRoutes = (app, routes) => {
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        // 下面这段是重点
        app[route.method](route.path, route.func)
    }
}

const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)


const routeBlog = require('./route/blog')
registerRoutes(app, routeBlog.routes)

const routeComment = require('./route/comment')
registerRoutes(app, routeComment.routes)

const main = () => {
    let server = app.listen(5000, '127.0.0.1', () => {
        let host = server.address().address
        let port = server.address().port

        log(`应用实例，访问地址为 http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}
