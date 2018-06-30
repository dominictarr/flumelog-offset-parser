# flumelog-offset-parser

A streaming parser for [flumelog-offset](https://github.com/flumedb/flumelog-offset)

I created this while researching performance improvements. This may or not be useful.
But here it is, if only so that my future self can understand what I was thinking right now.

## usage

```
var pull = require('pull-stream')
var File = require('pull-file')
var Stream = require('flumelog-offset-parser')

pull(
  File(filename),
  Stream(function (buffer, start, end, offset) {
    //this record is inbetween `start` and `end`.
    //the offset is the local key for this record.
    //start/end are aligned relative to buffer.
    //(which may be a copy if the record overlapped two blocks)

    //parse everything into JSON (ps, json is slow)
    return JSON.parse(buffer.slice(start, end))
  })
)

```

## License

MIT

