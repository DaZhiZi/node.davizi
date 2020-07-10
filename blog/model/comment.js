const fs = require('fs')

const commentFilePath = 'db/comment.json'

class ModelComment {
    constructor(form) {
        this.author = form.author || ''
        this.content = form.content || ''
        this.blog_id = form.blog_id || 0
        this.created_time = Math.floor(new Date() / 1000)
    }
}

const loadData = () => {
    let content = fs.readFileSync(commentFilePath, 'utf8')
    let data = JSON.parse(content)
    return data
}

const b = {
    data: loadData(),
}

b.all = function() {
    return this.data
}

b.new = function(form) {
    let m = new ModelComment(form)
    let d = this.data[this.data.length - 1]
    if (d === undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    this.data.push(m)
    this.save()
    return m
}

b.save = function() {
    let s = JSON.stringify(this.data, null, 2)
    fs.writeFile(commentFilePath, s, (error) => {
        if (error !== null) {
            console.log('error', error)
        } else {
            console.log('保存成功')
        }
    })
}

module.exports = b
