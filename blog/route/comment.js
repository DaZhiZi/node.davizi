const comment = require('../model/comment')

const all = {
    path: '/api/comment/all',
    method: 'get',
    func: (request, response) => {
        let comments = comment.all()
        let r = JSON.stringify(comments)
        response.send(r)
    }
}

const add = {
    path: '/api/comment/add',
    method: 'post',
    func: (request, response) => {
        let form = request.body
        let b = comment.new(form)
        let r = JSON.stringify(b)
        response.send(r)
    }
}

const routes = [
    all,
    add,
]

module.exports.routes = routes
