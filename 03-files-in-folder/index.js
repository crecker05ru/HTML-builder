const fs = require('fs');
const {stat } = require('fs/promises');
const path = require('path');
const { readdir } = require('fs/promises');

let targetFolder = 'secret-folder'
targetFolder = path.join(__dirname,targetFolder)

try {
  (async () => {
    // const files = await readdir(path.dirname(__filename,'secret-folder'));
    // const stat = await fs.stat(path.dirname(__filename,'secret-folder'))

    const files = await readdir(targetFolder);
    let direns = await readdir(targetFolder,{withFileTypes: true});
    console.log('diren',direns)
    console.log('files',files)
    // fs.stat(path.resolve(__filename),(err,stats) => {
    //   console.log('stats',stats)
    //   console.log('stats.isFile()',stats.isFile())
    // })
    for(const diren of direns){
      // console.log('diren',diren,'path.extname(diren)',path.extname(diren.name))
      // console.log('diren.isDirectory()',diren.isDirectory())
      if(diren.isDirectory()){
        let folder = await readdir(path.join(targetFolder,diren.name))
      }else {
        let statistic = await stat(path.join(targetFolder,diren.name))
        // console.log('__dirname',__dirname)
        let fileSizeKb = Number(statistic.size) === 0 ?  statistic.size : (statistic.size / 1000)
        console.log(diren.name.replace(path.extname(diren.name),''),'-',path.extname(diren.name).replace('.',''),'-',fileSizeKb + 'kb')
      }
    }
    // for (const file of files) {
    //   console.log('file',file,'path.extname(file)',path.extname(file))
    //   // console.log('path.extname(file)',path.extname(file))
    //   // console.log('stat',stat)
    // };
  })()

} catch (err) {
  console.error(err);
}

console.log('__filename',__filename)
console.log('__dirname',__dirname)
console.log('targetFolder',targetFolder)
// console.log(path.extname(__filename,'./secret-folder'))