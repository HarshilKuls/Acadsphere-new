const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, 'public', 'Acadshpere website logo.png');
const outputDir = path.join(__dirname, 'public');

async function generateIcons() {
  try {
    // Generate 192x192 icon
    await sharp(inputImagePath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(outputDir, 'icon-192x192.png'));
    
    console.log('Generated icon-192x192.png');

    // Generate 512x512 icon
    await sharp(inputImagePath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(outputDir, 'icon-512x512.png'));
      
    console.log('Generated icon-512x512.png');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
