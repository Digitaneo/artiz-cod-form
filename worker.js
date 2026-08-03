import { healthRoute } from "./routes/health.js";

export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/health") {

            return healthRoute(request, env);

        }

        return Response.json(

            {

                ok:false,

                error:"Route not found"

            },

            {

                status:404

            }

        );

    }

};