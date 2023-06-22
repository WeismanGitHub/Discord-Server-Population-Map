const iso31662 = require('iso-3166-2')
const https = require('https');
const fs = require('fs');

(async () => {
    for (const [threeCharCode, twoCharCode] of Object.entries(iso31662.codes)) {
        await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(`./topojson/${twoCharCode}.json`);
        
            https.get(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${threeCharCode}_1.json`, function(res) {
                res.pipe(file);
                
                file.on("finish", () => { file.close() });
    
                setTimeout(function () {
                    resolve();
                }, 1500)
            });
        })
    }
})()