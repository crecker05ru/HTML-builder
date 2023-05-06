const fs = require('fs')
const path = require('path');
const { mkdir } = require('fs/promises')
const { rmdir } = require('fs/promises')
const { rm } = require('fs/promises')
const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises') 

let copyDir = '/files-copy'
let sourceDir = '/files'
let srcPath = path.join(__dirname,sourceDir)
let copyPath = path.join(__dirname,copyDir)
let isFolderExist = false
fs.access(copyPath, err => {
  if(err){
    // rmdir(copyPath)
    console.log('err',copyPath)
  }else {
    // rmdir(copyPath,{ recursive: true, force: true })
    // rm(copyPath,{ recursive: true, force: true })
    console.log('!err',copyPath)
  }
})

// let maked  = mkdir(copyPath,{recursive: true})
// let mak = maked.then(data => {
//   console.log('data',data)
//   rmdir(copyPath,{ recursive: true, force: true })
// })
// console.log('mak',mak)
// console.log('maked',maked)
console.log('copyPath',copyPath)

async function copyFiles() {
  try {
    (async () => {
      console.log('isFolderExist',isFolderExist)
      let files = await readdir(srcPath);
      for(let file of files) {
        let buf = Buffer.from(file)
        console.log('file',file)
        // fs.writeFile(path.join(copyPath,file),buf,(e) => {
        //   if (e) throw e;
        //   console.log('The file has been saved!');
        // })
        copyFile(path.join(srcPath,file),path.join(copyPath,file))
      }
    })()
  
  }catch(e){
    console.log(e)
  }
}

mkdir(copyPath,{recursive: true}).then( (data) =>{ 
  console.log('Promise copyPath',data)
  if(!data){
    // rmdir(copyPath,{ recursive: true, force: true })
    rm(copyPath,{ recursive: true}).then(data => {
      console.log('rm',data)
      if(!data){
        mkdir(copyPath,{recursive: true})
        copyFiles()
      }
    })
    isFolderExist = true
    // mkdir(copyPath,{recursive: true})
  }else {
    isFolderExist = false
    copyFiles()
  }

  // rmdir(copyPath,{ recursive: true, force: true })
})