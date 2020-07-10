const ajax = (request) => {
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const templateBlog = (blog) => {
    let id = blog.id
    let title = blog.title
    let author = blog.author
    let d = new Date(blog.created_time * 1000)
    let time = d.toLocaleString()
    let t = `
        <div class="davizi-blog-cell">
            <div class="">
                <a class="blog-title" href="#" data-id="${id}">
                    ${title}
                </a>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="blog-comments">
                <div class="new-comment">
                    <input class="comment-blog-id" type=hidden value="${id}">
                    <input class="comment-author" value="">
                    <input class="comment-content" value="">
                    <button class="comment-add">添加评论</button>
                </div>
            </div>
        </div>
    `
    return t
}

const insertBlogAll = (blogs) => {
    let html = ''
    for (let i = 0; i < blogs.length; i++) {
        let b = blogs[i]
        let t = templateBlog(b)
        html += t
    }
    let div = document.querySelector('.davizi-blogs')
    div.innerHTML = html
}

const blogAll = () => {
    let request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: (response) => {
            let blogs = JSON.parse(response)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

const blogNew = (form) => {
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/blog/add',
        contentType: 'application/json',
        data: data,
        callback: (response) => {
            let res = JSON.parse(response)
        }
    }
    ajax(request)
}

const e = (selector) => document.querySelector(selector)

const bindEvents = () => {
    let button = e('#id-button-submit')
    button.addEventListener('click', (event) => {
        let form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
            mima: e('#id-input-mima').value,
        }
        blogNew(form)
    })
}

const __main = () => {
    blogAll()
    bindEvents()
}

__main()
