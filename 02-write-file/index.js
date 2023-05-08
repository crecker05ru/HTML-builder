const { stdin, stdout,stderr } = process;
const readline = require('readline');
const fs = require('fs')
const path = require('path')

stdout.write('Hello,write your text \n')

stdin.on('data', data => {
  if(data.toString().trim() === "exit"){
    stdout.write('Bye \n')
    process.exit()
  }
  fs.appendFile(path.join(__dirname,'/','text.txt'),data.toString(),err => {
    if(err) throw err
  })
})


process.on('SIGINT', () => {
  stdout.write('Bye \n')
  process.exit()
})
