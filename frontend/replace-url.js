const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ASUS/pengaduan-desa/frontend/src';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk(dir, function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Fix API calls
    if (content.includes('"http://localhost:5000/api')) {
        content = content.replace(/"http:\/\/localhost:5000\/api/g, '`${import.meta.env.VITE_API_URL}/api');
        // add backtick at the end of the string if we replaced a "
        // Wait, if it was "http://localhost:5000/api/pengaduan", it becomes `${import.meta.env.VITE_API_URL}/api/pengaduan"
        // This is bad regex.
    }
  }
});
