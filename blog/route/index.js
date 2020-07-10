const fs = require('fs')
const comment = require('../model/comment')

const sendHtml = (response, path) => {
    let options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

const index = {
    path: '/',
    method: 'get',
    func: (request, response) => {
        let path = 'blog_index.html'
        sendHtml(response, path)
    }
}

const routes = [
    index,
]

module.exports.routes = routes
