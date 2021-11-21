import { opine, serveStatic } from "https://deno.land/x/opine/mod.ts";
import { warning, error } from "https://deno.land/std/log/mod.ts";
import { ipList } from "https://deno.land/x/linux_ip/mod.ts";
import { keyboard, mouse } from "https://raw.githubusercontent.com/remode/xdotoolJS/master/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

import { panel } from "./admin.ts";
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
    .get("/m/:modid", async (req, res, next) => {
        await res.send(
            `
            ${Deno.readTextFileSync(`${Deno.cwd()}/public/default/res/topnav/nav.html`)}
            ${Deno.readTextFileSync(`${Deno.cwd()}/public/mods/${req.params.modid}/index.html`)}
            `
        );
    })
    .post("/post/keyboard", async (req, res) => {
        // Determine the size of the message and therefore how big a buffer we need.
        const contentLength = parseInt(req.headers.get("content-length") ?? "0");
        const buffer = new Uint8Array(contentLength);
        await req.body.read(buffer);
        const body = JSON.parse(new TextDecoder().decode(buffer))

        console.log(body.passwd == config.password && !config.bannedIps.includes(req.ip))
        console.log(req.ip)

        if (body.passwd == config.password && !config.bannedIps.includes(req.ip)) {
            console.log(`keyInput "${body.value}" from ${req.ip}`);
            if(body.options.isDown)
                keyboard.keyDown(body.value)
            else if(body.options.isUp)
                keyboard.keyUp(body.value)
            else
                keyboard.type(body.value)
            res.setStatus(200)
        }
        else res.setStatus(401)
        res.send("[]")
        console.log(body)
    })
    .post("/post/mouse", async (req, res) => {
        // Determine the size of the message and therefore how big a buffer we need.
        const contentLength = parseInt(req.headers.get("content-length") ?? "0");
        const buffer = new Uint8Array(contentLength);
        await req.body.read(buffer);
        const body = JSON.parse(new TextDecoder().decode(buffer))

        console.log(body.passwd == config.password && !config.bannedIps.includes(req.ip))
        console.log(req.ip)

        if (body.passwd == config.password && !config.bannedIps.includes(req.ip)) {
            console.log(`mouse input "${body.value}" from ${req.ip}`);
            mouse.mouseMoveRelative(body.value.x, body.value.y);
            res.setStatus(200)
        }
        else res.setStatus(401)
        res.send("[]")
        console.log(body)
    })
    .post("/post/button", async (req, res) => {
        const contentLength = parseInt(req.headers.get("content-length") ?? "0");
        const buffer = new Uint8Array(contentLength);
        await req.body.read(buffer);
        const body = JSON.parse(new TextDecoder().decode(buffer))

        console.log(body.passwd == config.password && !config.bannedIps.includes(req.ip))
        console.log(req.ip)

        if (body.passwd == config.password && !config.bannedIps.includes(req.ip)) {
            console.log(`mouse button input "${body.value}" from ${req.ip}`);
            if(body.options.isDown)
                mouse.mouseDown(body.value)
            else if(body.options.isUp)
                mouse.mouseUp(body.value)
            else
                mouse.click(body.value)
            res.setStatus(200)
        }
        else res.setStatus(401)
        res.send("[]")
        console.log(body)
    })

Deno.writeTextFileSync("./admin/tmp/info.txt", "")

app.listen({ port: port, hostname: hostname }, async () => {
    Deno.writeTextFileSync("./admin/tmp/info.txt",
        `http://${hostname}:${port}\n${String(await qrcode(`http://${hostname}:${port}`))}\n${config.password}`
    )
    console.log(`Remode server running at http://${hostname}:${port}`)
})

if (!config.disableControlPanel)
    panel.listen({ hostname: "localhost", port: 3000 }, () => {
        console.log("Remode admin panel running at http://localhost:3000")
    })
