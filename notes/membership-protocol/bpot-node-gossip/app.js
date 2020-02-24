var Gossiper = require('gossiper').Gossiper;

const port = process.argv[2]
let seeds = []
if (process.argv[3]) {
  seeds.push(process.argv[3])
}

const n = new Gossiper(port, seeds)
n.start();

n.on('update', (peer_name, key, value) => {
  console.log(`${port} update`, peer_name, key, value)
})
n.on('new_peer', (peer_name) => {
  console.log(`${port} new_peer`, peer_name)
  console.log('livePeers', n.livePeers())
})
n.on('peer_alive', (peer_name) => {
  console.log(`${port} peer_alive`, peer_name)
})
n.on('peer_failed', (peer_name) => {
  console.log(`${port} peer_failed`, peer_name)
  console.log('livePeers', n.livePeers())
  console.log('deadPeers', n.deadPeers())
})
