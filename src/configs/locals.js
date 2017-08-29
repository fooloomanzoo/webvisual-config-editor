import { locals } from "webvisual-schemas";

module.exports = {
  schema: locals,
  uiSchema: {
    items: {
      items: {
        svg: {
          path: {
            "ui:widget": "file",
            "ui:options": {
              accept: ".json"
            }
          }
        }
      }
    },
    svg: {
      items: {
        path: {
          "ui:widget": "file",
          "ui:options": {
            accept: ".json"
          }
        }
      }
    }
  },
  formData: {}
};
