const fs = require('fs');
const path = require("path")
const { readdir } = require("fs/promises")
const { appendFile } = require("fs")
const { copyFile } = require("fs/promises")

let outDir = "/project-dist"
let sourceDir = "/styles"
let outDirPath = path.join(__dirname, outDir)
let sourceDirPath = path.join(__dirname, sourceDir)

async function bundleCss() {
  try {
  let files = await readdir(sourceDirPath,{withFileTypes: true});
  console.log('files',files.length)
  const filesContent = []
  let filesCount = 0
  for(let file of files){

    if(path.extname(file.name).replace('.','') === 'css'){
      console.log('file',file)

      fs.readFile(path.join(sourceDirPath,file.name),'utf8', (err,data) => {
        if(!err){
          // console.log('data',data)
          // fs.appendFile(path.join(outDirPath,'/','bundle.css'),data,(err) => {
          //   if(err) throw err
          // })

          filesContent.push(data)
          filesCount += 1
          console.log('filesContent.length',filesContent.length)
          console.log('files.length',files.length)
          if(filesContent.length === filesCount) {
            // let buf = Buffer.from(filesContent)
            fs.writeFile(path.join(outDirPath,'/','bundle.css'),filesContent.join('\n'),(err) => {
              if (err) throw err
            })
          }


        }else {
          console.log(err)
        }
      })
      // let buf = Buffer.from(filesContent)

      // if(filesContent && filesContent.length > 0){
      //   fs.writeFile(path.join(outDirPath,'/','bundle.css'),'dwdwd',(err) => {
      //     if (err) throw err;
      //     console.log('filesContent',filesContent)
      //     console.log('buf',buf)
      //   })
      // }

      // fs.writeFile(path.join(outDirPath,'/','bundle.css'),buf,(err) => {
      //   if (err) throw err;
      //   console.log('filesContent',filesContent)
      //   console.log('buf',buf)
      // })
      // copyFile(path.join(sourceDirPath, file), path.join(outDirPath, file))
      // let buf = Buffer.from(file)

      // fs.appendFile(path.join(outDirPath,'bundle.css'),file,err => {
      //   if(err) throw err
      // })
    }
  }
}catch(e){
  console.log(e)
}
}

bundleCss()