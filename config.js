const fs = require('fs');

var config =
{
    password: "",
    bannedIps: JSON.parse(fs.readFileSync("banlist.json", "utf-8")),
    banUpdateInterval: 10000,   //In milliseconds
    listen: {
        port: 3000,
        hostname: "",           //If hostname is empty, the program will find an IP address 
        interfaceName: "Wi-Fi"  //using the ip module with the interface name
    }
}

module.exports = config;