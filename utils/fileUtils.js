const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  if (!filePath) return;
  // Normalize path to avoid issues
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
  console.log(`Attempting to delete file at: ${fullPath}`);
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File does not exist: ${fullPath}`);
      return;
    }
    fs.unlink(fullPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Failed to delete file: ${fullPath}`, unlinkErr);
      } else {
        console.log(`Deleted file: ${fullPath}`);
      }
    });
  });
};

module.exports = { deleteFile };
