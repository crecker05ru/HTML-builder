const fs = require("fs")
const path = require("path")
const { readdir } = require("fs/promises")
const { mkdir } = require("fs/promises")
const { rm } = require("fs/promises")
const { copyFile } = require("fs/promises")

let outDir = "/project-dist"
let sourceDir = "/"
let stylesDir = "/styles"
let assetsDir = "/assets"
let stylesDirPath = path.join(__dirname, stylesDir)
let assetsDirPath = path.join(__dirname, assetsDir)
let componentsFolder = "components"
let outDirPath = path.join(__dirname, outDir)
let sourceDirPath = path.join(__dirname, sourceDir)
let componentsFolderPath = path.join(__dirname, componentsFolder)
let templateName = "template.html"
let beforeDot = /.*(?=[\.])/ // /.*\./
let afterBracket = /\{{[^)]*\}}/
let betweenBrackets = /[^{\{]+(?=}\})/

function indexOf(array, toFind, arrProperty) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][arrProperty] === toFind) {
      return i
    }
  }
  return -1
}

async function writeHtml(temp) {
  try {
    fs.writeFile(path.join(outDirPath, "index.html"), temp, (err) => {
      if (err) throw err
    })
  } catch (e) {
    console.log("writeHtml", e)
  }
}

async function writeIndex() {
  let templateContent
  try {
    let sourceFiles = await readdir(sourceDirPath, { withFileTypes: true })
    let componentsFiles = await readdir(componentsFolderPath, {
      withFileTypes: true,
    })

    let templateIndex = indexOf(sourceFiles, templateName, "name")
    if (templateIndex !== -1) {
      fs.readFile(
        path.join(sourceDirPath, sourceFiles[templateIndex].name),
        "utf8",
        (err, data) => {
          if (!err) {
            templateContent = data
            for (let component of componentsFiles) {
              fs.readFile(
                path.join(componentsFolderPath, component.name),
                "utf8",
                (err, data) => {
                  if (!err) {
                    if (
                      templateContent.match(
                        component.name.match(beforeDot)[0]
                      )[0] === component.name.match(beforeDot)[0]
                    ) {
                      templateContent = templateContent.replace("{{"+component.name.match(beforeDot)[0]+"}}", data)
                      console.log('component.name.match(beforeDot)[0]',component.name.match(beforeDot)[0])
                      writeHtml(templateContent)
                    }
                  }
                }
              )
            }
          }
        }
      )
    }
  } catch (e) {
    console.log("writeIndex", e)
  }
}
async function build() {
  try {
    mkdir(outDirPath, { recursive: true }).then((data) => {
      if (!data) {
        try {
          rm(outDirPath, { recursive: true }).then((data) => {
            try {
              if (!data) {
                try {
                  mkdir(outDirPath, { recursive: true })
                  bundleCss()
                  writeIndex()
                  copyFolder(
                    path.join(sourceDirPath, assetsDir),
                    path.join(outDirPath, assetsDir)
                  )
                } catch (e) {
                  console.log("bundleCss,copyFolder", e)
                }
              }
            } catch (e) {
              console.log(rm, "e")
            }
          })
        } catch (e) {
          console.log("writeHtml rm", e)
        }
      } else {
        try {
          bundleCss()
          writeIndex()
          copyFolder(
            path.join(sourceDirPath, assetsDir),
            path.join(outDirPath, assetsDir)
          )
        } catch (e) {
          console.log("bundleCss,copyFolder", e)
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

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
                  path.join(outDirPath, "style.css"),
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

async function copyFiles(src, dest) {
  try {
    let files = await readdir(src, { withFileTypes: true })
    for (let file of files) {
      if (file.isDirectory()) {
        copyFolder(path.join(src, file.name), path.join(dest, file.name))
      } else {
        copyFile(path.join(src, file.name), path.join(dest, file.name))
      }
    }
  } catch (e) {
    console.log(e)
  }
}

async function copyFolder(src, dest) {
  try {
    mkdir(dest, { recursive: true }).then((data) => {
      if (!data) {
        try {
          rm(dest, { recursive: true }).then((data) => {
            if (!data) {
              try {
                mkdir(dest, { recursive: true })
                copyFiles(src, dest)
              } catch (e) {
                console.log("mkdir", e)
              }
            }
          })
        } catch (e) {
          console.log("rm", e)
        }
      } else {
        copyFiles(src, dest)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

try {
  build()
} catch (e) {
  console.log(e)
}
