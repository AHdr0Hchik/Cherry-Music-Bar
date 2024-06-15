const { execSync } = require('child_process');
const os = require('os');
const bcrypt = require('bcrypt');

class EasyResto {
    sid;
    disk_sid_hash;
    getDiskSerial() {
        try {
            let output;
            switch (os.platform()) {
                case 'win32':
                    output = execSync('wmic diskdrive get SerialNumber');
                    const lines = output.toString().trim().split('\n');
                    if (lines.length > 1) {
                        this.sid = lines[1].trim();
                        return lines[1].trim();
                    }
                    break;
                case 'darwin':
                    output = execSync('diskutil info / | grep "Volume UUID"');
                    this.sid = output.toString().split(':')[1].trim();
                    return output.toString().split(':')[1].trim();
                case 'linux':
                    output = execSync('lsblk -o NAME,SERIAL | grep "$(df / | tail -1 | awk \'{print $1}\')"');
                    this.sid = output.toString().split(/\s+/)[1];
                    return output.toString().split(/\s+/)[1];
                default:
                    throw new Error('Unsupported OS');
            }
        } catch (error) {
            console.error('Error fetching disk serial:', error);
            return null;
        }
    }
    
    async hashGenerator() {
        console.log(123 + this.sid);
        this.disk_sid_hash = await bcrypt.hash(this.sid, 7);
        return this.disk_sid_hash;
    }
    
       
}
module.exports = EasyResto;