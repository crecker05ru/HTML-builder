 
const {stat } = require('fs/promises');
const path = require('path');
const { readdir } = require('fs/promises');

let targetFolder = 'secret-folder'
targetFolder = path.join(__dirname,targetFolder)

try {
  (async () => {
    let direns = await readdir(targetFolder,{withFileTypes: true});

    for(const diren of direns){
      if(diren.isDirectory()){
        let folder = await readdir(path.join(targetFolder,diren.name))
      }else {
        let statistic = await stat(path.join(targetFolder,diren.name))
        let fileSizeKb = Number(statistic.size) === 0 ?  statistic.size : (statistic.size / 1000)
        console.log(diren.name.replace(path.extname(diren.name),''),'-',path.extname(diren.name).replace('.',''),'-',fileSizeKb + 'kb')
      }
    }
  })()

} catch (err) {
  console.error(err);
}