const blog = require('../model/blog')

const all = {
    path: '/api/blog/all',
    method: 'get',
    func: (request, response) => {
        let blogs = blog.all()
        let r = JSON.stringify(blogs)
        response.send(r)
    }
}

const add = {
    path: '/api/blog/add',
    method: 'post',
    func: (request, response) => {
        let form = request.body
        let r
        if (form.mima === '') {
            let b = blog.new(form)
            r = JSON.stringify(b)
        } else {
            r = JSON.stringify({})
        }
        response.send(r)
    }
}

const deleteBlog = {
    path: '/api/blog/delete',
    method: 'post',
    func: (request, response) => {
        let form = request.body
        let success = blog.delete(form.id)
        let result = {
            success: success,
        }
        let r = JSON.stringify(result)
        response.send(r)
    }
}

const routes = [
    all,
    add,
    deleteBlog,
]

module.exports.routes = routes
