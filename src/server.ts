import * as dotenv from "dotenv";

import { Origins, Server } from "boardgame.io/server";
import serve from "koa-static";
import path from "path";
import { TicTacToe } from "./app/_components/tic_tac_toe/Game";
import { TicTacToe4 } from "./app/_components/tic_tac_toe_4/Game";
import { Codenames } from "./app/_components/codenames/Game";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "8000");

const server = Server({
  games: [TicTacToe, TicTacToe4, Codenames],
  origins: [Origins.LOCALHOST],
});

// Build path relative to the server.ts file
const frontEndAppBuildPath = path.resolve(__dirname, "../out");
server.app.use(serve(frontEndAppBuildPath));

server.run({ port: PORT }, () => {
  server.app.use(
    async (ctx, next) =>
      await serve(frontEndAppBuildPath)(
        Object.assign(ctx, { path: "index.html" }),
        next,
      ),
  );
});
