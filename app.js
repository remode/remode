const express = require('express')
const path = require('path')
const fs = require('fs');
const ip = require('ip');
const spawn = require("child_process").spawn
const config = require('./config');

const app = express();
const hostname = config.listen.hostname === "" ?
    ip.address(config.listen.interfaceName) : config.listen.hostname;
const port = config.listen.port;

let password = config.password;
let bannedIps = config.bannedIps;
let banQueue = []

setInterval(() => {
    bannedIps = JSON.parse(fs.readFileSync("banlist.json", "utf8"));
    bannedIps = [...banQueue, ...bannedIps]; //Append the newly banned IPs to the start of the list
    banQueue = [];
    fs.writeFileSync("banlist.json", JSON.stringify(bannedIps, null, "    "));
}, config.banUpdateInterval);

app.get('/', function (req, res) {
    console.log(`${req.socket.remoteAddress} is trying to connect`);
    if (!bannedIps.includes(req.socket.remoteAddress)) {
        res.sendFile(path.join(__dirname + '/public/home/index.html'));
        console.log(`${req.socket.remoteAddress} is successful`);
    }
    else {
        res.send(`<h1>Sorry... This ip was banned<br>
        Please contact the host to fix the problem<br>
        If <span style="color:red">you</span> are the host, please check your config.js
        file and make sure you didn't accidentally ban yourself</h1>`);
        console.log(`${req.socket.remoteAddress} is unsuccessful, the ip was banned`);
    }
});

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.post("/", function (req, res) {
    let body = req.body;
    if (body.passwd === password && !bannedIps.includes(req.socket.remoteAddress)) {
        switch (body.type) {
            case "keyInput":
                console.log(`keyInput "${body.value}" from ${req.socket.remoteAddress}`);
                spawn("python3", ["./pythonScripts/keypress.py", body.value]).on("exit", (code) => {
                    res.status = code === 0 ? 200 : 500
                })
                break;
            case "mouseInput":
                console.log(`mouseInput ${body.value} from ${req.socket.remoteAddress}`);
                res.status = 501; // Not implemented yet
                break;
            case "gamepadInput":
                console.log(`gamepadInput ${body.value} from ${req.socket.remoteAddress}`);
                res.status = 501; //Not implemented yet
                break;
            default:
                break;
        }
    }
});

app.get('/modList', function (req, res) {
    fs.readdir("./public/mods", (err, files) => {
        let modNames = files;
        let modPaths = modNames.map(modName => "/public/mods/" + modName);
        res.send({
            modPaths: modPaths,
            modNames: modNames,
            modCount: files.length
        })
    });
})

app.listen(port, hostname, () => {
    console.log(`Example app listening at http://${hostname}:${port}`);
})