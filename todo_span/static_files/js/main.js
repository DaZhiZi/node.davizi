class Action {
    constructor() {

    }

    static new(...args) {
        return new this(...args)
    }

    add(self) {
        let task = e('.yy-input').value
        e('.yy-input').value = ''
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