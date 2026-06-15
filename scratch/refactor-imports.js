const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(path.join(dir, f));
    }
  });
}

function refactor(dir) {
  walkDir(dir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/@\/components\/(?!admin\/|front\/)/g, '@/components/front/');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated', filePath);
    }
  });
}

refactor('src/app/(blog)');
refactor('src/components/front');
