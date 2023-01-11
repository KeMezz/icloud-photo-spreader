const path = require("path");
const os = require("os");
const fs = require("fs");

const folder = process.argv[2];
const workingDir = path.join(os.homedir(), "Pictures", folder);
if (!folder || !fs.existsSync(workingDir)) {
  console.error("Please enter folder name in Pictures");
  return;
}

const combinedDir = path.join(workingDir, "combined");
!fs.existsSync(combinedDir) && fs.mkdirSync(combinedDir);

fs.promises
  .readdir(workingDir, { withFileTypes: true })
  .then((folders) => processFolders(folders))
  .catch(console.error);

function processFolders(folders) {
  folders.forEach((file) => {
    const dirName = file.name;
    if (file.isDirectory()) {
      const fileDir = path.join(workingDir, dirName);
      fs.promises
        .readdir(fileDir)
        .then((files) => processFiles(files, dirName))
        .catch(console.error);
    } else {
      console.log(`${dirName} is not a directory`);
      return;
    }
  });
}

function processFiles(files, dirName) {
  files.forEach((file) => {
    move(dirName, file, combinedDir);
  });
}

function move(parentDir, file, targetDir) {
  console.info(`move ${file} to ${path.basename(targetDir)}`);
  const oldPath = path.join(workingDir, parentDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises.rename(oldPath, newPath).catch(console.error);
}
