'use strict'

// require the module, it returns a HashRing constructor
var HashRing = require('hashring')

const keycount = process.argv[2] // この数値が小さい (10 とか) だと偏りが大きくなるが、大きくすると (200 以上) 分散具合が綺麗になっていく

// Setup hash rings with your servers, in this example I just assume that all
// servers are equal, and we want to bump the cache size to 10.000 items.

// var ring = new HashRing([
//     '127.0.0.1',
//     '127.0.0.2',
//     '127.0.0.3',
//     '127.0.0.4'
//   ], 'md5', {
//     'max cache size': 10000
//   })

// 重み付け変えると気持ち、偏りに反映されているような？ 極端につけると分かりやすく偏る。
// vnodes の値を大きくすると、若干、分散が平均化するような？？ いや変わらんか？
var ring = new HashRing({
  '127.0.0.1': { vnodes: 100 },
  '127.0.0.2': { vnodes: 100 },
  '127.0.0.3': { vnodes: 100 },
  '127.0.0.4': { vnodes: 100 }
}, 'md5', {
  'max cache size': 10000
})

  // 下記のハッシュアルゴリズムが使えそう。ただし hashring 内部の crypto ライブラリは廃止されているようだ。
  // そして、いくつか試したが、どれでも分散具合に大きく差は無いような？
  // 
  // 'md4',
  // 'md4WithRSAEncryption',
  // 'md5',
  // 'md5WithRSAEncryption',
  // 'mdc2',
  // 'mdc2WithRSA',
  // 'ripemd',
  // 'ripemd160',
  // 'ripemd160WithRSA',
  // 'rmd160',
  // 'rsa-md4',
  // 'rsa-md5',
  // 'rsa-mdc2',
  // 'rsa-ripemd160',
  // 'rsa-sha',
  // 'rsa-sha1',
  // 'rsa-sha1-2',
  // 'rsa-sha224',
  // 'rsa-sha256',
  // 'rsa-sha384',
  // 'rsa-sha512',
  // 'sha1',
  // 'sha1WithRSAEncryption',
  // 'sha224',
  // 'sha224WithRSAEncryption',
  // 'sha256',
  // 'sha256WithRSAEncryption',
  // 'sha384',
  // 'sha384WithRSAEncryption',
  // 'sha512',
  // 'sha512WithRSAEncryption',
  // 'ssl3-md5',
  // 'ssl3-sha1',
  // 'whirlpool'

// Now we are going to get some a server for a key
// ring.get('foo bar banana') // returns 127.0.0.x

// テスト用のキーを作成
let keymap = {}
for (var i = 0;i < keycount;i++) {
  keymap["x" + Math.random().toString(32).substring(2)] = []
}
// キーから対応するサーバを取得
Object.keys(keymap).forEach((key) => {
  const server = ring.get(key)
  keymap[key].push(server)
})
// 1 回目と同じサーバになるはずだが、念の為もう一度取得
Object.keys(keymap).forEach((key) => {
  const server = ring.get(key)
  keymap[key].push(server)
})
// 1 回目、2 回目と同じサーバになるはずだが、しつこく確認のため取得
Object.keys(keymap).forEach((key) => {
  const server = ring.get(key)
  keymap[key].push(server)
})
console.dir(keymap)

// 分散具合を確認 ==> 結構偏ってるなw
let bias = {}
Object.keys(keymap).forEach((key) => {
  if (bias.hasOwnProperty(keymap[key][0])) {
    bias[keymap[key][0]] = bias[keymap[key][0]] + 1
  } else {
    bias[keymap[key][0]] = 1
  }
})
console.dir(bias)

// for (var i = 0;i < keys.length;i++) {
//   const server = ring.get(keys[i])
//   console.log(server, keys[i])
// }

// Or if you might want to do some replication scheme and store/fetch data from
// multiple servers
// ring.range('foo bar banana', 2).forEach(function forEach(server) {
//   console.log(server) // do stuff with your server
// })

// Add or remove a new a server to the ring, they accept the same arguments as
// the constructor
// ring.add('127.0.0.7').remove('127.0.0.1')

