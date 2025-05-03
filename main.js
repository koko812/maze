const size = 30
const width = 10
const height = 10

// これを外に出しておくべきだというのはなんとなく気持ちはわかる
let map = []
for (let y = 0; y < height + 2; y++) {
    map[y] = []
    // ここでよくわからん迷路を定義する
    // 番兵を作るのを忘れるな
    // （番兵は良くないというが，じゃあどうやって可読性を高めるんだろうかという感じが）
    // （番兵って読みやすくない？もっとスマートな書き方があるならその真似をしたいけど）
    for (let x = 0; x < width + 2; x++) {
        if (y === 0 || y === height + 1 || x === 0 || x === width + 1) {
            map[y][x] = {
                'checked': true
            }
        } else {
            map[y][x] = {
                'checked': false,
                'top': false,
                'bottom': false,
                'left': false,
                'right': false
            }
        }
    }
}

const init = () => {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.width = `${size * width}`
    container.style.height = `${size * height}`
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // 待ってくれこれ
            const tile = document.createElement('div')
            tile.style.position = 'absolute'
            // px を忘れていて表示されなかったという，クソ雑魚ナメクジ
            // 死ぬまで反省し続けろカス
            tile.style.width = `${size}px`
            tile.style.height = `${size}px`
            tile.style.top = `${size * y}px`
            tile.style.left = `${size * x}px`
            tile.style.backgroundColor = '#0ac'
            tile.style.border = '1px solid'
            tile.style.boxSizing = 'border-box'
            container.appendChild(tile)
        }
    }
    document.body.appendChild(container)
}

window.onload = () => {
    init()
}