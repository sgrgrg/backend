const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function convertSvgToJpg(filePath) {
  const jpgPath = filePath.replace(/\.svg$/i, '.jpg');
  try {
    await sharp(filePath)
      .jpeg({ quality: 90 })
      .toFile(jpgPath);
    console.log(`Converted ${filePath} to ${jpgPath}`);
  } catch (error) {
    console.error(`Failed to convert ${filePath}:`, error);
  }
}

function scanAndConvert(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        scanAndConvert(fullPath);
      } else if (file.isFile() && /\.svg$/i.test(file.name)) {
        convertSvgToJpg(fullPath);
      }
    });
  });
}

scanAndConvert(uploadsDir);
