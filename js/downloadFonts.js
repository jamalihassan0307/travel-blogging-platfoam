const fs = require('fs');
const https = require('https');

const fonts = [
  {
    name: 'poppins-regular.woff2',
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2'
  },
  {
    name: 'poppins-medium.woff2',
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2'
  },
  {
    name: 'poppins-semibold.woff2',
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2'
  }
];

fonts.forEach(font => {
  https.get(font.url, (response) => {
    const fileStream = fs.createWriteStream(`fonts/${font.name}`);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`Downloaded ${font.name}`);
    });
  });
}); 