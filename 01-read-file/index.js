const fs = require('node:fs')
const path = require('node:path'); 

const file = path.resolve(__dirname,'text.txt')
const stream = fs.createReadStream(file,'utf-8')

let text = ''
stream.on('data',chunk => text += chunk)
stream.on('end', () => console.log(text))
stream.on('error', error => console.log('Error', error.message))