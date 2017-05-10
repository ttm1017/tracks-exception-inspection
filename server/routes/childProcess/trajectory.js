const spawn = require('child_process').spawn;

const trajectory = (file, input, trajectoryId) => new Promise((resolve, reject) => {
    const command = spawn('/Users/taotanming/project/tracks-exception-inspection/trajectory/main', [file, trajectoryId]);
    let data = {
        stdout: Buffer.from([]),
        stderr: Buffer.from([]),
        code: 0,
    };
    command.stdout.on('data', trunk => {
        data.stdout = Buffer.concat([data.stdout, trunk], data.stdout.length + trunk.length);
    });
    command.stderr.on('data', trunk => {
        data.stderr = Buffer.concat([data.stderr, trunk], data.stderr.length + trunk.length);
    });
    command.on('close', code => {
        if (code == 0) {
            resolve(data);
        } else {
            data.code = code;
            reject(data);
        }
    });
    command.stdin.write(input.map(v => v.join(' ')).join('\n'));
    command.stdin.end();
});

module.exports = trajectory;