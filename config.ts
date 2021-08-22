var config = {
    password: "",
    bannedIps: JSON.parse(Deno.readTextFileSync("banlist.json")) || [],
    banUpdateInterval: 10000, //In milliseconds
    listen: {
        port: 3000,
        hostname: "", //If hostname is empty, the program will find an IP address 
        interfaceName: "wlp3s0" //using the ip module with the interface name
    }
}

export default config