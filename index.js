const path = require("path");
const os = require("os");
const fs = require("fs");

const folderArg = process.argv[2];
const targetDir = path.join(os.homedir(), "Pictures", folderArg);
if (!folderArg || !fs.existsSync(targetDir)) {
  console.error("Please enter folder name in Pictures");
  return;
}
const combinedDir = path.join(targetDir, "combined");
!fs.existsSync(combinedDir) && fs.mkdirSync(combinedDir);

fs.promises
  .readdir(targetDir, { withFileTypes: true })
  .then((folders) => processFolders(folders))
  .catch(console.error);

function processFolders(folders) {
  folders.forEach((file) => {
    const dirName = file.name;
    if (file.isDirectory()) {
      const fileDir = path.join(targetDir, dirName);
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
  if (dirName === "combined") {
    return;
  }
  files.forEach((file) => {
    move(dirName, file);
  });
}

function move(parentDir, file) {
  console.info(`move ${file} to ${path.basename(combinedDir)}`);
  const oldPath = path.join(targetDir, parentDir, file);
  const newPath = path.join(combinedDir, file);
  fs.promises.rename(oldPath, newPath).catch(console.error);
}
