var tape = require('tape')
var buffer = new Buffer(1024)

function write(start, value, length) {
  buffer.writeUInt32BE(length, start) //first length
  buffer.fill(value, start+4, start+4+length) //value
  buffer.writeUInt32BE(length, start+4+length) //second length
  buffer.writeUInt32BE(start+4+length+8, start+4+length+4) //length of the file
  return start+4+length+8
}

var as = []
// buffer.writeUInt32BE(8, 4+9+8)
// buffer.fill(1, 4, 4+9)
// buffer.writeUInt32BE(10+12, 10)

var start = 0
start=write(start, 1, 8)
start=write(start, 2, 9)
start=write(start, 3, 10)
buffer = buffer.slice(0, start)

console.log(buffer.toString('hex'))

var slices = require('./slices')

//var as = []
//for(var i = 0; i < 100; i++) {
  var a_1 = new Buffer(8)
  a_1.fill(1)
  as.push(a_1)
  var a_2 = new Buffer(9)
  a_2.fill(2)
  var a_3 = new Buffer(10)
  a_3.fill(3)


function test (size) {
  tape('test:'+size, function (t) {
    var i = size
    var a = [], start = 0
    while(start < buffer.length) {
      a.push(buffer.slice(start, start += start+i))
    }
    var o = []
    console.log(a)
    a.reduce(function (state, buffer) {
      console.log('state', state, buffer)
      return slices(state, buffer, function (buffer, start, end) {
        console.log('slice', start, end)
        o.push(buffer.slice(start, end))
      })
    }, null)
    t.deepEqual(o, [a_1, a_2, a_3])
    t.end()
  })
}

//for(var i = 16; i < buffer.length; i++) {
//}

//var a = [buffer.slice(0, 20), buffer.slice(20)]
//console.log(a)
//var state = slices(null, a[0], function (buffer, start, end) {
//  console.log(buffer.slice(start, end))
//})
//slices(state, a[1], function (buffer, start, end) {
//  console.log(buffer.slice(start, end))
//})




test(32)
test(24)
test(25)
test(31)

test(17)
test(18)
test(19)

