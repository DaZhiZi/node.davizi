const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')

const {log} = require('./utils')

const app = express()

const todoFilePath = './todo.json'

const loadData = () => {
    let content = fs.readFileSync(todoFilePath, 'utf8')
    let data = JSON.parse(content)
    return data
}

const saveData = (data) => {
    let s = JSON.stringify(data, null, 2)
    fs.writeFile(todoFilePath, s, (error) => {
        if (error !== null) {
            console.log('error', error)
        } else {
            console.log('保存成功')
        }
    })
}

const todoList = loadData()

app.use(express.static('static_files'))
app.use(bodyParser.json())

const sendHtml = (response, path) => {
    let options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        log(`读取的 html 文件 ${path} 内容是`, data)
        response.send(data)
    })
}

app.get('/', (request, response) => {
    let path = 'index.html'
    sendHtml(response, path)
})

const sendJSON = (response, data) => {
    let r = JSON.stringify(data, null, 2)
    response.send(r)
}

app.get('/todo/all', (requrest, response) => {
    sendJSON(response, todoList)
})

const todoAdd = (form) => {
    if (todoList.length === 0) {
        form.id = 1
    } else {
        let lastTodo = todoList[todoList.length - 1]
        form.id = lastTodo.id + 1
    }
    form.done = false
    todoList.push(form)
    saveData(todoList)
    return form
}


app.post('/todo/add', (request, response) => {
    let form = request.body
    let todo = todoAdd(form)
    sendJSON(response, todo)
})

const todoDelete = (id) => {
    id = Number(id)
    let index = -1
    for (let i = 0; i < todoList.length; i++) {
        let t = todoList[i]
        if (t.id === id) {
            // 找到了
            index = i
            break
        }
    }
    if (index > -1) {
        // 找到了, 用 splice 函数来删除
        // splice 函数返回的是包含被删除元素的数组
        // 所以要用 [0] 取出数据
        let t = todoList.splice(index, 1)[0]
        return t
    } else {
        // 没找到
        return {}
    }
}


app.get('/todo/delete/:id', (request, response) => {
    let id = request.params.id
    let todo = todoDelete(id)
    saveData(todoList)
    sendJSON(response, todo)
})

const todoCompleted = (id) => {
    id = Number(id)
    let index = -1
    for (let i = 0; i < todoList.length; i++) {
        let t = todoList[i]
        if (t.id === id) {
            // 找到了
            index = i
            break
        }
    }
    if (index > -1) {
        todoList[index].done = !todoList[index].done
        let t = todoList[index]
        return t
    } else {
        return {}
    }
}

app.get('/todo/completed/:id', (request, response) => {
    let id = request.params.id
    let todo = todoCompleted(id)
    saveData(todoList)
    sendJSON(response, todo)
})

const todoUpdate = (id, form) => {
    id = Number(id)
    let index = -1
    for (let i = 0; i < todoList.length; i++) {
        let t = todoList[i]
        if (t.id === id) {
            index = i
            break
        }
    }
    if (index > -1) {
        todoList[index].task =  form.task
        let t = todoList[index]
        return t
    } else {
        return {}
    }
}

app.post('/todo/update/:id', (request, response) => {
    let id = request.params.id
    let form = request.body
    let todo = todoUpdate(id, form)
    log('todo', todo)
    saveData(todoList)
    sendJSON(response, todo)
})


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