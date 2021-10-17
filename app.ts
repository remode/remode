import { opine, serveStatic } from "https://deno.land/x/opine/mod.ts";
import { warning, error } from "https://deno.land/std/log/mod.ts";
import { ipList } from "https://deno.land/x/linux_ip/mod.ts";
import { keyboard } from "https://deno.land/x/xdotool@v1.0.1/mod.ts";

import config from "./config.ts"

const port = config.listen.port
const hostname = config.listen.hostname || ((await ipList()).find((val) => {
    return (Array.isArray(config.listen.interfaceNames)) ?
        config.listen.interfaceNames.includes(val.name) :
        config.listen.interfaceNames === val.name
})?.ipv4)

if (hostname == undefined) {
    throw new Error("No matching ip address for the list of hostnames specified found");

}

const app = opine();

app
    .use(async (_req, _res, next) => {
        try {
            await next();
        } catch (err) {
            error(err)
        }
    })
    .use(async (req, res, next) => {
        if (config.bannedIps.includes(req.ip))
            res.send(`<h1>Sorry... This ip was banned<br>
                Please contact the host to fix the problem<br>
                If <span style="color:red">you</span> are the host, please check your config.js
                file and make sure you didn't accidentally ban yourself</h1>`);
        else
            await next();
    })
    .use("/public", serveStatic(`${Deno.cwd()}/public`))
    .get("/", (_req, res) => {
        res.sendFile(`${Deno.cwd()}/public/home/index.html`)
    })
    .get("/modList", async (_req, res) => {
        const modList = []
        for await (const modPath of Deno.readDir("./public/mods")) {
            if (modPath.isDirectory) {
                try {
                    const modProp = JSON.parse(await Deno.readTextFile(`./public/mods/${modPath.name}/${modPath.name}.modconfig`))
                    modProp["modPath"] = modPath.name;
                    modList.push(modProp)
                }
                catch (error) {
                    modList.push(
                        {
                            "modId": "unknown",
                            "modName": "Unknown Mod",
                            "modDesc": `modPath:"${modPath}", "${modPath}.modconfig" file not found`,
                            "modDescHover": JSON.stringify(error),
                            "modPath": modPath.name
                        }
                    )
                    warning(`The mods directory contains invalid mod config "${modPath.name}"`)
                }
            }
            else {
                warning("The mods dircetory contains something other than a directory, check your mods directory")
            }
        }

        res.type("application/json")
        res.send(JSON.stringify(modList, null, 2))
    })
    .post("/post/keyboard", async (req, res, next) => {
        // Determine the size of the message and therefore how big a buffer we need.
        const contentLength = parseInt(req.headers.get("content-length") ?? "0");
        const buffer = new Uint8Array(contentLength);
        await req.body.read(buffer);
        const body = JSON.parse(new TextDecoder().decode(buffer))

        console.log(body.passwd == config.password && !config.bannedIps.includes(req.ip))
        console.log(req.ip)
        
        if (body.passwd == config.password && !config.bannedIps.includes(req.ip)) {
            console.log(`keyInput "${body.value}" from ${req.ip}`);
            keyboard.type(body.value)
            res.setStatus(200)
        }
        else res.setStatus(401)
        res.send("[]")
        console.log(body)

    })

app.listen({ port: port, hostname: hostname }, () => { console.log(`http://${hostname}:${port}`) })

// TODO: Implement POST endpoints and better authentication
// Old server code:
// app.post('/post/keyboard', (req, res) => {
//     let body = req.body;
//     console.log(body)
//     if (body.passwd === password && !bannedIps.includes(req.socket.remoteAddress)) {
//         console.log(`keyInput "${body.value}" from ${req.socket.remoteAddress}`);
//         spawn("python3", ["./pythonScripts/keypress.py", body.value]).on("exit", (code) => {
//             res.status(code === 0 ? 200 : 500).send(["ok", code]);
//         });
//     }
// });

