'use strict'
module.exports = function (state, buffer, each) {
  var length
  if(!state) state = {
    pointer: 0, block: 0,
    //length: -1,
    remainder: null
  }

  if(state.remainder) {
    var _remainder = state.remainder.length
    //TODO if remainder is less than 4, we need to concat some of buffer just to get the length
    length = (_remainder < 4 ? Buffer.concat([state.remainder, buffer.slice(0, 4 - _remainder)]) : state.remainder).readUInt32BE(0)
    each(Buffer.concat([state.remainder, buffer.slice(0, 4+length - _remainder)]), 4, 4+length, state.pointer)
    state.pointer += length + 12
    state.remainder = null
  }
  var ptr = state.pointer - state.block
  if(ptr < buffer.length - 4) {
    length = buffer.readUInt32BE(ptr)
    while(state.pointer + 12 + length <= state.block + buffer.length) {
      var ptr = state.pointer - state.block
      length = buffer.readUInt32BE(ptr)

      each(buffer, ptr + 4, ptr + 4 + length, state.pointer)
      state.pointer += length + 12
      if(state.pointer <= state.block + buffer.length - 4)
        length = buffer.readUInt32BE(state.pointer - state.block)
      else
        length = 0
    }
  }
  if(state.pointer < buffer.length + state.block)
    state.remainder = buffer.slice(state.pointer - state.block)
  state.block += buffer.length
  return state
}












