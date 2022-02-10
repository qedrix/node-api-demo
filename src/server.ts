import App from './app';
import config from "config";

import TokenController from './auth/token.controller';
import UserController from './user/user.controller';
import HeartbeatController from './health/heartbeat.controller';

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = new App(
    [
        new HeartbeatController(),
        new UserController(),
        new TokenController(),
    ], 
    host, port
);

app.listen();