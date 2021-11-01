const config: {
    listen: {
        port: number; hostname: string; interfaceNames: string | string[]
    }; bannedIps: string[]; password?: string; banUpdateInterval?: number; disableControlPanel?: boolean;
} =
{
    password: "",
    bannedIps: JSON.parse(Deno.readTextFileSync("banlist.json")) || [],
    banUpdateInterval: 10000, //In milliseconds
    listen: {
        port: 3000,
        hostname: "", //If hostname is empty, remode will find an IP address using interfaceNames
        interfaceNames: ["Wi-Fi", "wlan0", "wlp3s0"] //interface name/names that remode will attempt to listen on
    },
    disableControlPanel: false
}

export default config;
