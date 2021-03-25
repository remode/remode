const http = require('http');
const fs = require('fs');
const qs = require('qs');
const ip = require('ip');

const port = 3000;
let hostname = ip.address("Wi-Fi");

const server = http.createServer((req, res) => {
    if (req.method == "GET") {
        req.url = "." + req.url;
        fs.readFile((req.url == "./") ? "index.html" : req.url, (err, data) => {
            if (err) {
                console.error(`${err.code}:${req.url}`)
                switch (err.code) {
                    case "ENOENT":
                        res.statusCode = 404;
                        break;
                    default:
                        res.statusCode = 500;
                        break;
                }
                res.end();
            }
            else {
                res.statusCode = 200;
                res.end(data);
            }
        });
    }
    else if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;

            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.socket.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            console.log(post);
            res.statusCode = 200;
            res.end()
        });
    }


});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
