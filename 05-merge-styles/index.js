const fs = require("fs")
const path = require("path")
const { readdir } = require("fs/promises")

let outDir = "/project-dist"
let sourceDir = "/styles"
let outDirPath = path.join(__dirname, outDir)
let sourceDirPath = path.join(__dirname, sourceDir)

async function bundleCss() {
  try {
    let files = await readdir(sourceDirPath, { withFileTypes: true })
    const filesContent = []
    let filesCount = 0
    for (let file of files) {
      if (path.extname(file.name).replace(".", "") === "css") {
        fs.readFile(
          path.join(sourceDirPath, file.name),
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

bundleCss()
