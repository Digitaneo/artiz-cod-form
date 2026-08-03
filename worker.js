import { healthRoute } from "./routes/health.js";
import { installRoute } from "./routes/install.js";

export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/health") {
            return healthRoute(request, env);
        }

        if (url.pathname === "/install") {
            return installRoute(request, env);
        }

        return Response.json({

            ok:false,

            error:"Route not found"

        },{status:404});

    }

};