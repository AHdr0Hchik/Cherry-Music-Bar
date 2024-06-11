const axios = require('axios');
const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const { execSync } = require('child_process');
const Model = require('../models');

class Updater {

    async downloadAndApplyUpdate(version) {
        try {
            const { data } = await axios.get(
                `http://${process.env.MAIN_SERVER_HOST}:${process.env.MAIN_SERVER_PORT}/api/download/${version}`,
                {
                    responseType: 'stream',
                    headers: {
                        'serialid': process.env.SID
                    }
                }
            );

            const zipFilePath = path.join(__dirname, '..', 'updates', `update-${version}.zip`);
            const writer = fs.createWriteStream(zipFilePath);

            data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            const updateDir = path.join(__dirname, '..', 'updates');
            const projectRoot = path.join(__dirname, '..', '..');
            await extract(zipFilePath, { dir: projectRoot });
            execSync('npm install', {
                cwd: projectRoot,
                stdio: 'inherit' // Показывает вывод npm install в консоль
            });
            await Model.easyresto.update(
                {
                    version: version,
                },
                {
                    where: {id: 1}
                }
            );

            console.log(`Update to version ${version} applied successfully.`);

            process.exit(0);
            
        } catch (error) {
            console.error('Error downloading or applying update:', error.message);
            console.error(error);
        }
    }

    async checkForUpdates() {
        try {
            // Получаем информацию о последней версии
            const { data } = await axios.get(`http://${process.env.MAIN_SERVER_HOST}:${process.env.MAIN_SERVER_PORT}/api/check_updates`,
                {
                    headers: {
                        'serialid' : process.env.SID
                    }
                }
            );
            const latestVersion = data.version;
            const currentVersion = await Model.easyresto.findAll();
            if (latestVersion != currentVersion[0].version) {
                return {has_license: true, has_update: true, latest_version: latestVersion};
            } else {
                console.log('No updates available.');
            }
            return true;
        } catch (error) {
            console.error('Error checking for updates:', error.message);
            return false;
        }
    }

    
}
module.exports = Updater