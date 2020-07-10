const fs = require('fs')
const path = require('path')

// 把 fs.readdir 封装成 promise 的形式, 方便使用
const readdir = (path) => {
    let p = new Promise((resolve, reject) => {
        fs.readdir(path, (error, files) => {
            if (error !== null) {
                reject(error)
            } else {
                resolve(files)
            }
        })
    })
    return p
}



// const loadAudio = () => {
//     let dir = 'audios'
//     let pathname = path.join(__dirname, dir)
//     readdir(pathname).then((files) => {
//         // files 是 audios 目录下的文件
//         // 从这些文件中筛选以 .mp3 结尾的文件, 也就是 mp3 文件
//         let audios = files.filter((e) => e.endsWith('.mp3'))
//         insertAudios(audios)
//     })
// }
// 周杰伦 - Mojito
let list = [
    {
        music_url: 'audios/周杰伦 - .爱的飞行日记.mp3',
        cover_url: 'static/img/爱的飞行日记.jpg',
        song_name: '爱的飞行日记',
        song_decription: 'Teleradio Donoso fue una banda chilena de indie rock y pop rock formada en 2005, Formada inicialmente',
        singer: '周杰伦',
        heart: false,
        star: false,
    },
    {
        music_url: 'audios/周杰伦 - .龙卷风 (Live).mp3',
        cover_url: 'static/img/龙卷风 (Live).jpg',
        song_name: '龙卷风 (Live)',
        song_decription: '在一起的两个人相爱的很快，但经过一些挫折后两个人的爱情又像龙卷风一样快速的离开了，但是他(她）却非常失落，感觉不会再爱了。',
        singer: '周杰伦',
        heart: false,
        star: false,
    },
    {
        music_url: 'audios/周杰伦 - Mojito.mp3',
        cover_url: 'static/img/Mojito.jpeg',
        song_name: 'Mojito',
        song_decription: '「Mojito」是一种传统的古巴鸡尾酒，更是大文豪海明威的最爱，如缪斯女神般存在的Mojito，黄俊郎以此酒为主题，为周杰伦这首充满古巴风情、带着轻快的节奏、随兴摇摆曲风的创作，写出一种遇见爱情时，令人神往的浪漫情调；来到一个第一次到访的异国城市，心头涌上一种「旧城市里的新恋情」的激荡，是每个旅人的心情，彷佛前世就来过一般既视感与命运感，让旧城更添一种神秘向往。',
        singer: '周杰伦',
        heart: true,
        star: false,
    },
    {
        music_url: 'audios/周杰伦 - .听妈妈的话.mp3',
        cover_url: 'static/img/听妈妈的话.jpg',
        song_name: '听妈妈的话',
        song_decription: '　回首往事往往心有感触。作为一个音乐人，周杰伦用一首完美的歌曲表达出了自己对母亲的无比的感恩，想必周妈妈听到这首歌曲后也会相当的欣慰。其实不只是周妈妈，世界上所有的孩子如果能够将这首歌曲献给自己的母亲，那个画面是该有多么的美好。听妈妈的话，别让她受伤。',
        singer: '周杰伦',
        heart: false,
        star: false,
    },
    {
        music_url: 'audios/周杰伦 - .简单爱.mp3',
        cover_url: 'static/img/简单爱.jpg',
        song_name: '简单爱',
        song_decription: '学生时期那种纯纯的恋爱，是清涩而单纯的。骑单车、看日落，纷繁的浮世中，谁不向往这般简简单单的情景，周杰伦正是对这种感情的感悟，进而凝练，创作出来的一首歌曲。',
        singer: '周杰伦',
        heart: false,
        star: false,
    },
    {
        music_url: 'audios/WANDS (ワンズ) - 世界が終るまでは… (直到世界尽头) (TV Version).mp3',
        cover_url: 'static/img/bg.jpg',
        song_name: '直到世界尽头',
        song_decription: '当初被启用作为《灌篮高手》的片尾曲时，歌曲名被误写成《世界が终るまでは》，其正确的应该为《世界が终わるまでは》。很多网友也认为该曲是为剧中人物三井寿创作的主题音乐。',
        singer: 'WANDS (ワンズ)',
        heart: true,
        star: false,
    },

]

const option = {
    current_index: 0,
    playing: false,
}
let audio = e('#id-audio-player')

const bindPlay = function() {
    let button = e('.icon-play')
    button.addEventListener('click', function() {
        option.playing = true
        audio.play()
    })
}

const bindPause = function() {
    let button = e('.icon-pause')
    button.addEventListener('click', function() {
        option.playing = false
        audio.pause()
    })
}

const bindTime = function() {
    let a = audio

    this.time_id = setInterval(function() {
        let current = formatTime(a.currentTime)
        e('.elapsed').innerHTML = current
        updateProgress()
    }, 1000)
}

const getNewSongIndex = function(offset) {
    let count = list.length
    let current = option.current_index
    let new_index = (current + offset + count) % count
    // log('new_index', new_index)
    return new_index
}

const audioCanplay = function() {
    let a = audio
    a.addEventListener('canplay', function() {
        // log('播放完毕, 在 canplay 事件中获取 duration', a.duration)
        a.play()
    })
}

const updateSong = function() {
    let i = option.current_index
    let s = list[i]
    audio.src = s.music_url

    e('.gua-cover-image').src = s.cover_url

    for (let e of es('.gua-song-name')) {
        e.innerHTML = s.song_name
    }
    e('.gua-song-decription').innerHTML = s.song_decription
    e('.gua-singer').innerHTML = s.singer

    // // toggle
    // // heart: boolean,
    if (e('.icon-heart').classList) {
        e('.icon-heart').classList.remove('red')
    }
    if (s.heart) {
        e('.icon-heart').classList.add('red')
    }
    // // star: boolean,
    if (option.playing) {
        audioCanplay()
    }
}

const bindSong = function() {
    let a = audio
    let list = e('.controls')
    list.addEventListener('click', function(event) {
        // log('click song')
        let item = event.target
        if (item.classList.contains('gua-control-song')) {
            let offset = Number(item.dataset.offset)
            // log('offset', offset)
            option.current_index = getNewSongIndex(offset)
            updateSong()
        }
    })
}

const bindMode = function() {
    //默认循环列表播放
    let a = audio
    a.addEventListener('ended', function() {
        let offset = +1
        option.current_index = getNewSongIndex(offset)
        updateSong()
    })
}

const toggle = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

const updateList = function() {
    // heart
    let i = option.current_index
    list[i].heart = !list[i].heart
}

const bindToggleHeart = function() {
    // love   icon-heart
    let l = e('.love')
    l.addEventListener('click', function(event) {
        let item = event.target
        if (item.classList.contains('icon-heart')) {
            let className = 'red'
            toggle(item, className)
            updateList()
        }
    })
}

const bindToggle = function() {
    bindToggleHeart()
}

const bindProgress = function() {
    let inner = e('.inner')
    let outer = e('.outer')
    let dot = e('.dot')
    // let result = e('#id-em-move')

    // 获取最外层 outer 元素的宽度, 进度条不能超过这个值
    let max = outer.offsetWidth
    // 用开关来表示是否可以移动, 可以按下开关的时候才能移动
    let moving = false

    // 初始偏移量
    let offset = 0

    dot.addEventListener('mousedown', (event) => {
        log('event', event.clientX, dot.offsetLeft, event.clientX - dot.offsetLeft)
        // event.clientX 是浏览器窗口边缘到鼠标的距离
        // dot.offsetLeft 是 dot 元素左上角到父元素左上角的距离
        // offset 就是父元素距离浏览器窗口边缘的距离, 注意这个值基本上是不变的
        offset = event.clientX - dot.offsetLeft
        moving = true
    })

    document.addEventListener('mouseup', (event) => {
        moving = false
    })

    document.addEventListener('mousemove', (event) => {
        if (moving) {
            // 离浏览器左侧窗口当前距离减去父元素距离浏览器左侧窗口距离就是
            // dot 移动的距离
            let x = event.clientX - offset
            // dot 距离有一个范围, 即 0 < x < max
            if (x > max) {
                x = max
            }
            if (x < 0) {
                x = 0
            }
            let width = (x / max) * 100
            inner.style.width = String(width) + '%'
            updateCurrentTime(width / 100)
            // result.innerHTML = x
        }
    })

}

const updateProgress = function() {
    let a = audio
    let percent = a.currentTime / a.duration
    let width = 100 * percent
    let inner = e('.inner')
    inner.style.width = String(width) + '%'
}

const updateCurrentTime = function(percent) {
    audio.currentTime = audio.duration * percent
}

const bindEvents = function() {
    bindPlay()
    bindPause()
    bindTime()
    bindSong()
    bindMode()
    bindToggle()
    bindProgress()
}

const __main = function() {
    bindEvents()
}

__main()