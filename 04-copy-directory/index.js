const path = require("path")
const { mkdir } = require("fs/promises")
const { rm } = require("fs/promises")
const { readdir } = require("fs/promises")
const { copyFile } = require("fs/promises")

let copyDir = "/files-copy"
let sourceDir = "/files"
let srcPath = path.join(__dirname, sourceDir)
let copyPath = path.join(__dirname, copyDir)

async function copyFiles() {
  try {
    let files = await readdir(srcPath)
    for (let file of files) {
      console.log("file", file)
      copyFile(path.join(srcPath, file), path.join(copyPath, file))
    }
  } catch (e) {
    console.log(e)
  }
}

mkdir(copyPath, { recursive: true }).then((data) => {
  if (!data) {
    rm(copyPath, { recursive: true }).then((data) => {
      if (!data) {
        mkdir(copyPath, { recursive: true })
        copyFiles()
      }
    })
  } else {
    copyFiles()
  }
})
