const log = console.log.bind(console)

const ajax = (method, path, data, callback) => {
    let p = new Promise((resolve, reject) => {
        let r = new XMLHttpRequest()
        r.open(method, path, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                resolve(r.response)
            }
        }
        if (method === 'POST') {
            data = JSON.stringify(data)
        }
        r.send(data)
    })
    return p
}

const apiTodoAll = (callback) => {
    let method = 'GET'
    let path = '/todo/all'
    let data = ''
    return ajax(method, path, data, callback)
}

const apiTodoAdd = (task, callback) => {
    let method = 'POST'
    let path = '/todo/add'
    let data = {
        task: task,
    }
    return ajax(method, path, data, callback)
}

const apiTodoDelete = (id, callback) => {
    let method = 'GET'
    let path = '/todo/delete/' + String(id)
    let data = ''
    return ajax(method, path, data, callback)
}

const apiTodoCompleted = (id, from, callback) => {
    let method = 'GET'
    let path = '/todo/completed/' + String(id)
    let data = ''
    return ajax(method, path, data, callback)
}

const apiTodoUpdate = (id, form, callback) => {
    let method = 'POST'
    let path = '/todo/update/' + String(id)
    let data = form
    return ajax(method, path, data, callback)
}

const e = (sel) => {
    return document.querySelector(sel)
}

const bindEvent = (element, eventName, callback) => {
    element.addEventListener(eventName, callback)
}

const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
}

const templateTodo = (todo) => {
    let {id, task, done} = todo
    let d1 = done ?  'fa-check-circle' : 'fa-circle-thin'
    let d2 = done ? 'lineThrough' : ''

    let t = `
         <li class="item yy-cell ">
                     <i class="fa  co yy-todo-completed ${d1}"  id="${id}"></i>
                     <p class="text ${d2} yy-todo-update" id="${id}">${task}</p>
                     <i class="fa fa-trash-o de yy-todo-delete " id="${id}"></i>  
            </li>
    `
    return t
}

const insertTodo = (todo) => {
    let container = e('.yy-todo-container')
    let t = templateTodo(todo)
    appendHtml(container, t)
}

const loadTodos = (todos) => {
    e('.yy-todo-container').innerHTML = ''
    let ts = JSON.parse(todos)
    for (let t of ts) {
        insertTodo(t)
    }
}
