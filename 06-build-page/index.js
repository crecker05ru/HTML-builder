const fs = require("fs")
const path = require("path")
const { readdir } = require("fs/promises")
const { mkdir } = require("fs/promises")
const { rm } = require("fs/promises")
const { copyFile } = require("fs/promises")

let outDir = "/project-dist"
let sourceDir = "/"
let stylesDir = '/styles'
let assetsDir = '/assets'
let stylesDirPath = path.join(__dirname, stylesDir)
let assetsDirPath = path.join(__dirname, assetsDir)
let componentsFolder = 'components'
let outDirPath = path.join(__dirname, outDir)
let sourceDirPath = path.join(__dirname, sourceDir)
let componentsFolderPath = path.join(__dirname, componentsFolder)
let templateName =  'template.html'
let templateContent
let beforeDot = /.*(?=[\.])/ // /.*\./
let afterBracket = /\{{[^)]*\}}/

// function isTemplate(element,index){
//   console.log('element',element)
//   if(element.name === templateName){

//     return index
//   }
// }

function indexOf(array,toFind,arrProperty){
  for(let i = 0; i < array.length;i += 1){
    if(array[i][arrProperty] === toFind){
      return i
    }
  }
  return -1
}

async function writeHtml(temp){
  mkdir(outDirPath, { recursive: true }).then((data) => {
    if (!data) {
      rm(outDirPath, { recursive: true }).then((data) => {
        if (!data) {
          mkdir(outDirPath, { recursive: true })
          // copyFiles()
          fs.writeFile(
            path.join(outDirPath, "index.html"),
            temp,
            (err) => {
              // console.log('templateContent',templateContent)
              if (err) throw err
            }
          )
        }
      })
    } else {
      // copyFiles()
      fs.writeFile(
        path.join(outDirPath, "index.html"),
        temp,
        (err) => {
          // console.log('templateContent',templateContent)
          if (err) throw err
        }
      )
    }
  })
}

async function build(){
  try {
    let sourceFiles = await readdir(sourceDirPath, { withFileTypes: true })
    let componentsFiles = await readdir(componentsFolderPath, { withFileTypes: true })
    
    let templateIndex = indexOf(sourceFiles,templateName,'name')
    console.log('sourceFiles',sourceFiles)
    console.log('templateIndex',templateIndex)
    if(templateIndex !== -1){
      fs.readFile(path.join(sourceDirPath, sourceFiles[templateIndex].name),"utf8",(err,data) => {
        if (!err) {
          // console.log('data',data)
          templateContent =  data
          for(let component of componentsFiles){
            fs.readFile(path.join(componentsFolderPath, component.name),"utf8",(err,data) => {
              if (!err) {
                // console.log('data',data)
                
                // console.log('component.name.match(beforeDot)',component.name.match(beforeDot)[0])
      
                // console.log('templateContent.match(component.name.match(beforeDot)[0])',templateContent.match(component.name.match(beforeDot)[0]))
                // console.log('component.name.match(beforeDot)[0]',component.name.match(beforeDot)[0])
                // console.log('templateContent.match(component.name.match(beforeDot)[0])[0]',templateContent.match(component.name.match(beforeDot)[0])[0])
                if(templateContent.match(component.name.match(beforeDot)[0])[0] === component.name.match(beforeDot)[0]){
                  // console.log('if(templateContent')
                templateContent.replace(afterBracket,data)
                // writeHtml(templateContent)
                writeHtml(templateContent.replace(afterBracket,data))
                }

                
                // fs.appendFile(path.join(__dirname,'/','text.txt'),data.toString(),err => {
                //   if(err) throw err
                // })

                // if(templateContent.afterBracket === beforeDot.matches(component.name))
                // templateContent.replace(afterBracket,data)
              }
              

              
      
              // fs.writeFile(
              //   path.join(outDirPath, "index.html"),
              //   'templateContent',
              //   (err) => {
              //     console.log('templateContent',templateContent)
              //     if (err) throw err
              //   }
              // )
            })
          }
        }
      })
    }

    // for(let component of componentsFiles){
    //   fs.readFile(path.join(componentsFolderPath, component.name),"utf8",(err,data) => {
    //     if (!err) {
    //       // console.log('data',data)
          
    //       // console.log('component.name.match(beforeDot)',component.name.match(beforeDot)[0])

    //       // console.log('templateContent.match(component.name.match(beforeDot)[0])',templateContent.match(component.name.match(beforeDot)[0]))

    //       if(templateContent.match(component.name.match(beforeDot)[0]) === component.name.match(beforeDot)[0])
    //       templateContent.replace(afterBracket,data)
    //       // if(templateContent.afterBracket === beforeDot.matches(component.name))
    //       // templateContent.replace(afterBracket,data)
    //     }

    //     fs.writeFile(
    //       path.join(outDirPath, "/", "index.html"),
    //       templateContent,
    //       (err) => {
    //         if (err) throw err
    //       }
    //     )
    //   })
    // }

    // return new Promise((resolve,reject) => {
    //   // resolve(templateContent)
    //   let buf = Buffer.from(String(templateContent))
    //   resolve(buf)
    //   reject(new Error())
    // })

  }catch(e){
    console.log(e)
  }

}

// async function readFile(file){
//   try {
//     let sourceFiles = await readdir(sourceDirPath, { withFileTypes: true })
//     let componentsFiles = await readdir(componentsFolderPath, { withFileTypes: true })
    
//     let templateIndex = indexOf(sourceFiles,templateName,'name')
//     console.log('sourceFiles',sourceFiles)
//     console.log('templateIndex',templateIndex)
//     if(templateIndex !== -1){
//       fs.readFile(path.join(sourceDirPath, sourceFiles[templateIndex].name),"utf8",(err,data) => {
//         if (!err) {
//           console.log('data',data)
//         }
//       })
//     }
//   }catch(e){
//     console.log(e)
//   }
// }

async function bundleCss() {
  try {
    let files = await readdir(stylesDirPath, { withFileTypes: true })
    const filesContent = []
    let filesCount = 0
    for (let file of files) {
      if (path.extname(file.name).replace(".", "") === "css") {
        fs.readFile(
          path.join(stylesDirPath, file.name),
          "utf8",
          (err, data) => {
            if (!err) {
              filesContent.push(data)
              filesCount += 1
              if (filesContent.length === filesCount) {
                fs.writeFile(
                  path.join(outDirPath, "/", "bundle.css"),
                  filesContent.join("\n"),
                  (err) => {
                    if (err) throw err
                  }
                )
              }
            } else {
              console.log(err)
            }
          }
        )
      }
    }
  } catch (e) {
    console.log(e)
  }
}

async function copyFiles() {
  try {
    let files = await readdir(assetsDirPath)
    for (let file of files) {
      copyFile(path.join(assetsDirPath, file), path.join(outDirPath,assetsDir,file))
    }
  } catch (e) {
    console.log(e)
  }
}

async function copyAssets(){
  try {
    mkdir(path.join(outDirPath,stylesDir), { recursive: true }).then((data) => {
      if (!data) {
        rm(path.join(outDirPath,stylesDir), { recursive: true }).then((data) => {
          if (!data) {
            mkdir(path.join(outDirPath,stylesDir), { recursive: true })
            copyFiles()
          }
        })
      } else {
        copyFiles()
      }
    })
  }catch(e){
    console.log(e)
  }
}

try {
  build()
  // copyAssets()
  // bundleCss()
}catch(e){
  console.log(e)
}

// build().then(data => writeHtml(data),e => console.log(e))
