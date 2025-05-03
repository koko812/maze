const size = 40
const width = 40
const height = 20

let gameStart = false
let refleshRate = 20
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
                //'top': false,
                //'bottom': false,
                // 穴を掘っていく処理なので，up,down の方が直感的な感じがある
                // こういうしょうもないわかりづらいコードをリファクタするツールは絶対にあるはず
                // 忙しい研究者には絶対役に立つと思われる

                // データ構造を定義していると考えて，階層構造を作った方が後から扱いやすいかも，確かに
                // これも，プログラマはデータ構造を扱うっていうことだよね
                'wall': {
                    'up': true,
                    'down': true,
                    'left': true,
                    'right': true
                }
            }
        }
    }
}

// この関数で全ループを回さなくて，ほりたいところだけ持ってくるようにしたら，
// 流石にもうちょっと早くなりそうになるんだけど，それをやるには，結構頭を使う必要がある
// そのため一旦断念ということで
// というか，ここの browzer を使わずに，適当な python server とかでたてれば，
// 少なくともこちらのブラウザには影響がないのでそれでいいのではないかという感じはある
const showMap = () => {
    borderWidth = size / 30 + 'px'
    // 全く必要はないんだけど，文字列を掛け算したりしたらどうなるんだろうか
    // 俺なら 100% px をつけ忘れていた
    for (let y = 1; y <= height; y++) {
        for (let x = 1; x <= width; x++) {
            cell = map[y][x] // これをちゃんと変数定義するのが t-kihira 流
            cell.element.style.borderWidth =
                // こんなクソみたいな書き方で，枠周りの border を上下左右別に調整できるらしい
                // こんなもん知らねえと書けねえよ
                `${cell.wall.up ? borderWidth : 0} ` +
                `${cell.wall.right ? borderWidth : 0} ` +
                `${cell.wall.down ? borderWidth : 0} ` +
                `${cell.wall.left ? borderWidth : 0} `;
            // まさかの空白が必要だということをわかってなかったという，
            // 天下一の無知蒙昧，無職自称
            // だがしかし両方空いてしまってるのはよくない
            console.log('show');
            console.log(cell.element.style.borderWidth)
            console.log(x, y, map[y][x].wall.right, map[y][x].wall.left)
        }
    }
}
const digTarget = [[1, 1]]
map[1][1].checked = true

// 処理の流れ
// digTarget が dig する目標のスタック
// digTarget からランダムに上下左右に進む
// check されてたらその方向は無視する
// ランダムに上下左右を選ぶのは，math random * len(directionlist) を使えば ok
// wall.up とかが必要なのかと一瞬思ったが，表示の際に必要なはず
// target の checked は一つでも開いたら問答無用で true にする
// direction_list はもうとにかく全部入れて，tx が求まった後に checked なら continue すればいい
const vector = {
    'up': [0, -1],
    'down': [0, 1],
    'left': [-1, 0],
    'right': [1, 0],
}

const dig = async () => {
    // 再帰系のコードは無限ループが起こりそうなので，いつもドキドキする
    while (digTarget.length) {
        const [x, y] = digTarget.pop()

        // ゴールの方向を一方高だけに絞る処理
        // 他の場所から掘られる場合のみを考えるってことだな
        // 普通に天才すぎてやばい，というか，他の部分がわかってないとこれ書けねえだろ
        if (x === width && y === height) {
            continue;
        }
        let action = false;
        const baseDirection = ['up', 'down', 'left', 'right']
        // choice する処理がややこしくて辛い
        // これは単純に並び替えてるだけなのか（じゃあシャッフルでよくねと思うが，js にはないのかも？）
        directionList = []
        while (baseDirection.length) {
            const item = baseDirection.splice(Math.trunc(Math.random() * baseDirection.length), 1)[0]
            directionList.push(item)
        }
        for (direction of directionList) {
            // この辺り，baseDirection を [0,1] とかで定義しないのは，可読性的に verygood だな
            // ここも dx とかを書いた方がわかりやすいっぽい
            //tx = x + vector[direction][0]
            //ty = y + vector[direction][1]

            // 辞書のアクセスの仕方がふた通りあるのが全然意識してなかった
            const [dx, dy] = vector[direction]
            tx = x + dx
            ty = y + dy
            if (map[ty][tx].checked) {
                continue
            }
            // この辺の処理が必要なのか悩みながら書いた
            map[ty][tx].checked = true
            // 多分 ↓ を書く前に，一回穴が開くかを確認するらしい
            digTarget.push([tx, ty])
            action = true

            switch (direction) {
                case 'up':
                    map[y][x].wall.up = false
                    map[ty][tx].wall.down = false
                    break;
                case 'down':
                    map[y][x].wall.down = false
                    map[ty][tx].wall.up = false
                    break;
                case 'left':
                    map[y][x].wall.left = false
                    map[ty][tx].wall.right = false
                    break;
                case 'right':
                    map[y][x].wall.right = false
                    map[ty][tx].wall.left = false
                    break;
                default:
                    break;
            }
            if (action) {
                //digTarget.push([x,y]) //push だと頭に入ってしまって面白くない
                showMap()
                await new Promise(r => setTimeout(r, refleshRate))
                digTarget.unshift([x, y])
            }
            // いやこの処理書くだけで，掘れるだけ掘るって感じの処理にするのマジで天才すぎだろ
            break;


            // ここで break するならなぜ while で回したんだろうか・・・
            // 浅はかな私にはわからない深い理由があったのかもしれない
            // もっとシンプルに描ける可能性もあるこということを覚えておこう

            // 深遠な理由というか，これごめん各マス一度だけとかそういう縛りはないらしい？
        }
    }

}


const init = () => {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.width = `${size * width}`
    container.style.height = `${size * height}`
    for (let y = 1; y <= height; y++) {
        for (let x = 1; x <= width; x++) {
            // 待ってくれこれ
            const tile = document.createElement('div')
            tile.style.position = 'absolute'
            // px を忘れていて表示されなかったという，クソ雑魚ナメクジ
            // 死ぬまで反省し続けろカス
            tile.style.width = `${size}px`
            tile.style.height = `${size}px`
            tile.style.top = `${size * (y - 1)}px`
            tile.style.left = `${size * (x - 1)}px`
            tile.style.backgroundColor = '#8cf'
            tile.style.border = '1px solid #000'
            tile.style.boxSizing = 'border-box'
            // この代入方法で，勝手に辞書型に登録されるの，js は便利だと感じるくない？
            map[y][x].element = tile
            container.appendChild(tile)
            //console.log(map[y][x].element);
        }
    }
    document.body.appendChild(container)
    /*
    const button = document.getElementById('start')
    button.onclick = (e) => {
        e.preventDefault()
        gameStart = true
        console.log(gameStart)
        dig()
    }
        */
}

window.onload = () => {
    init()
    //setInterval なら回るが，timeout だと回らないというクソ仕様
    //setInterval(() => {
    //    console.log(gameStart);
    //}, 10)
    //if (gameStart) {
    //console.log('gamestart', gameStart);
    dig()
    showMap()
   // }
}