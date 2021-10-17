// Admin Control Panel Code

import { opine, serveStatic } from "https://deno.land/x/opine/mod.ts";
import { warning, error } from "https://deno.land/std/log/mod.ts";

const panel = opine();

panel
    .use(async (_req, _res, next) => {
        try {
            await next();
        } catch (err) {
            error(err)
        }
    })
    .use(serveStatic("./admin"))

export { panel }