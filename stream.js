var slices = require('./slices')

module.exports = function (parse) {
  var state, output = []
  return function (read) {
    return function (abort, cb) {
      if(output.length) return cb(null, output.shift())

      read(abort, function (err, data) {
        if(err) {
          return cb(err) //there should not be any remainder
        }
        state = slices(state, data, function (buffer, start, end, offset) {
          var data = parse(buffer, start, end, offset)
          output.push(data)
        })
        cb(null, output.shift())
      })
    }
  }
}






