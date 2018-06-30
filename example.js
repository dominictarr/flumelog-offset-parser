var stream = require('./stream')
var pull = require('pull-stream')
var File = require('pull-file')

var k = +process.argv[3] || 64
var json = !+process.argv[4]

var parse
  var msg_id = '%HPMQEUbULKcJJMEAP/iMnVfuykNZ9llEymArjkuEO/A=.sha256'

if(!json) {
  var binary = require('binary')
  var value = new Buffer('value')
  var content = new Buffer('content')
  var root = new Buffer('root')

  var buf_id = Buffer.allocUnsafe(binary.encodingLength(msg_id))
  binary.encode(msg_id, buf_id, 0)
  parse = function (buffer, start, end) {
    var p = binary.seekKey(buffer, start, value)
    var p2 = binary.seekKey(buffer, p, content)
    var p3 = binary.seekKey(buffer, p2, root)
    if(~p3) {
      if(buffer.compare(buf_id, 0, buf_id.length, p3, p3+buf_id.length) == 0) {
        return 1
      }
    }
  }
}
else {
  parse = function (buffer, start, end) {
    var data = JSON.parse(buffer.slice(start, end))
    if(data.value.content.root == msg_id)
//      console.error(data.key)
    return 1
  }
}

var c = 0, ts = Date.now(), T = 0, start = Date.now()
pull(
  File(process.argv[2], {bufferSize: k*1024}),
  stream(parse),
  pull.drain(function (d) {
    T += d
    c++
    if(Date.now() > ts + 1000) {
      console.error('C:', c, T)
      ts = Date.now()
    }
  }, function () {
    console.error('C:', c, T)
    console.log(Date.now() - start)
  })
)





