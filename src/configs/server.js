import { server } from "webvisual-schemas";

module.exports = {
  schema: server,
  uiSchema: {
    _tmpDir: {
      "ui:widget": "hidden"
    },
    ssl: {
      cert: {
        "ui:widget": "file"
      },
      key: {
        "ui:widget": "file"
      },
      passphrase: {
        "ui:widget": "file"
      },
      ca: {
        "ui:widget": "file",
        "ui:options": {
          directory: true
        }
      }
    }
  },
  formData: {}
};
