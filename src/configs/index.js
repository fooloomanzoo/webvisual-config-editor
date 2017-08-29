import server from "./server";
import configfiles from "./configfiles";
import locals from "./locals";
import connections from "./connections";

export const configs = {
  Server: server,
  Connection: connections,
  Configfiles: configfiles,
  Locals: locals
};
