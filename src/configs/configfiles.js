import { configfiles } from "webvisual-schemas";

module.exports = {
  schema: configfiles,
  uiSchema: {
    paths: {
      items: {
        "ui:widget": "file",
        "ui:options": {
          accept: ".json"
        }
      }
    }
  },
  formData: {}
};
