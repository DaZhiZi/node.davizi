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

class Action {
    constructor() {

    }

    static new(...args) {
        return new this(...args)
    }

    add(self) {

        let task = e('.yy-input').value
        apiTodoAdd(task)
    }

    delete(self) {
        let id = self.id
        log('id', id)
        apiTodoDelete(id)
    }

    completed(self) {
        let id = self.id
        log('id', id)
        apiTodoCompleted(id)
    }

    update(self) {
        let id = self.id
        let task = self.innerHTML
        let form = {
            task,
        }
        log('self', task, id)
        apiTodoUpdate(id, form)
    }
}


const bindEdit = () => {
    e('.yy-todo-container').addEventListener('keydown', event => {
        let self = event.target
        if (self.classList.contains('text')) {
            // event.key 为 Enter 表示按下的是回车键
            if (event.key === 'Enter') {
                // log('按了回车键', event)
                // 取消事件的默认行为, 回车键在编辑标签内容的时候会默认换行
                event.preventDefault()
                self.contentEditable = false
                Action.new().update(self)
            }
        }
    })
}


const bindEventTodo = () => {
    bindEvent(e('body'), 'click', event => {
        let self = event.target
        log('self', self)
        let apiAction = Action.new()
        let has = self.classList.contains.bind(self.classList)

        if (has('yy-todo-add')) {
            apiAction.add(self)
        }
        if (has('yy-todo-delete')) {
            apiAction.delete(self)
        }
        if (has('yy-todo-completed')) {
            apiAction.completed(self)
        }

        if (has('text')) {
            self.contentEditable = true
            self.focus()
        } else {
            loadTodoAll()
        }
    })

}

const bindEvents = () => {
    bindEventTodo()
    bindEdit()
}

const loadTodoAll = async () => {
    // 用同步的思维写异步程序
    let l2 = await apiTodoAll()

    loadTodos(l2)
}

const initDate = () => {
    let options = {weekday : "long", month:"short", day:"numeric"}
    let today = new Date()

    e('#date').innerHTML = today.toLocaleDateString("en-US", options)
}

const init = () => {
    initDate()
    loadTodoAll()
}

const __main = () => {
    init()
    bindEvents()
}

__main()