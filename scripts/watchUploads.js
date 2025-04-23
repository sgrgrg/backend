const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

let pushTimeout = null;
const debounceDelay = 5000; // 5 seconds debounce

function gitPushChanges() {
  console.log('Detected changes in uploads. Preparing to push to GitHub...');
  exec('git add .', { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
    if (err) {
      console.error('Error during git add:', err);
      return;
    }
    exec('git commit -m "Auto commit: uploads changed"', { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
      if (err) {
        if (stderr.includes('nothing to commit')) {
          console.log('No changes to commit.');
        } else {
          console.error('Error during git commit:', err);
        }
        return;
      }
      exec('git push', { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
        if (err) {
          console.error('Error during git push:', err);
          return;
        }
        console.log('Successfully pushed changes to GitHub.');
      });
    });
  });
}

const watcher = chokidar.watch(uploadsDir, {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', filePath => {
    console.log(`File added: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on('change', filePath => {
    console.log(`File changed: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on('unlink', filePath => {
    console.log(`File removed: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  });

console.log(`Watching for changes in ${uploadsDir}...`);
