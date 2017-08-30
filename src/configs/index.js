import server from "./server";
import configfiles from "./configfiles";
import locals from "./locals";
import connections from "./connections";

export const configs = {
  server: server,
  connection: connections,
  configfiles: configfiles,
  locals: locals
};
