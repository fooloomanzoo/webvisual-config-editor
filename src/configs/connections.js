import { connections } from "webvisual-schemas";

module.exports = {
  schema: connections,
  uiSchema: {
    in: {
      file: {
        items: {
          path: {
            "ui:widget": "file"
          },
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json",
              editwith: "locals"
            }
          }
        }
      },
      database: {
        items: {
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json",
              editwith: "locals"
            }
          }
        }
      },
      udp: {
        items: {
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json",
              editwith: "locals"
            }
          }
        }
      }
    }
  },
  formData: {}
};
