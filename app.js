//-------OLD CODE----------

// const http = require('http');
// const fs = require('fs');
// const ip = require('ip');
// const spawn = require("child_process").spawn

// const port = 3000;
// let hostname = ip.address("Wi-Fi");

// const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
// const password = config.password || "";
// const banlist = config.banlist || [];

// const server = http.createServer((req, res) => {
//     if (req.method == "GET") {
//         try {
//             req.url = "." + req.url + (fs.statSync(req.url).isDirectory ? "index.html" : "");
//         } catch (error) {
//             console.log(error);
//         }

//         fs.readFile(req.url, (err, data) => {
//             if (err) {
//                 console.error(`${err.code}:${req.url}`)
//                 switch (err.code) {
//                     case "ENOENT":
//                         res.statusCode = 404;
//                         break;
//                     default:
//                         res.statusCode = 500;
//                         break;
//                 }
//                 res.end();
//             }
//             else {
//                 res.statusCode = 200;
//                 res.end(data);
//             }
//         });
//     }
//     else if (req.method == 'POST') {
//         var body = '';
//         req.on('data', function (data) {
//             body += data;

//             // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//             if (body.length > 1e6)
//                 req.socket.destroy();
//         });

//         req.on('end', function () {
//             var post = JSON.parse(body);
//             console.log(post);
//             console.log(req.socket.remoteAddress);
//             if (post.passwd === password && !banlist.includes(req.socket.remoteAddress)) {
//                 spawn("python3", ["./pythonScripts/keypress.py", post.value])
//             }
//             res.statusCode = 200;
//             res.end()
//         });
//     }
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
