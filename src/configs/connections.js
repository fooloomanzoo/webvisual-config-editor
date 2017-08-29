import { connections } from "webvisual-schemas";

module.exports = {
  schema: connections,
  uiSchema: {
    in: {
      file: {
        items: {
          path: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json"
            }
          },
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json"
            }
          }
        }
      },
      database: {
        items: {
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json"
            }
          }
        }
      },
      udp: {
        items: {
          localconfigfile: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json"
            }
          }
        }
      }
    }
  },
  formData: {}
};
