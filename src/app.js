import React, { Component } from "react";
import { render } from "react-dom";
import Codemirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";

import { shouldRender } from "./utils.js";
import { FileWidget } from "./widgets";

import { configs } from "./configs";
import Form from "react-jsonschema-form";

// Import a few CodeMirror themes; these are used to match alternative
// bootstrap ones.
import "codemirror/lib/codemirror.css";

const widgets = {
  file: FileWidget
};

// Patching CodeMirror#componentWillReceiveProps so it's executed synchronously
// Ref https://github.com/mozilla-services/react-jsonschema-form/issues/174
Codemirror.prototype.componentWillReceiveProps = function(nextProps) {
  if (
    this.codeMirror &&
    nextProps.value !== undefined &&
    this.codeMirror.getValue() != nextProps.value
  ) {
    this.codeMirror.setValue(nextProps.value);
  }
  if (typeof nextProps.options === "object") {
    for (var optionName in nextProps.options) {
      if (nextProps.options.hasOwnProperty(optionName)) {
        this.codeMirror.setOption(optionName, nextProps.options[optionName]);
      }
    }
  }
};

const log = type => console.log.bind(console, type);
const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);
const cmOptions = {
  theme: "paper",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2
};

const themes = {
  default: {
    stylesheet:
      "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
  },
  paper: {
    stylesheet:
      "//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/paper/bootstrap.min.css"
  }
};

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: true, code: props.code };
  }

  componentWillReceiveProps(props) {
    this.setState({ valid: true, code: props.code });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onCodeChange = code => {
    this.setState({ valid: true, code });
    setImmediate(() => {
      try {
        this.props.onChange(fromJson(this.state.code));
      } catch (err) {
        this.setState({ valid: false, code });
      }
    });
  };

  render() {
    const { title, theme } = this.props;
    const icon = this.state.valid ? "ok" : "remove";
    const cls = this.state.valid ? "valid" : "invalid";
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className={`${cls} glyphicon glyphicon-${icon}`} />
          {" " + title}
        </div>
        <Codemirror
          value={this.state.code}
          onChange={this.onCodeChange}
          options={Object.assign({}, cmOptions, { theme })}
        />
      </div>
    );
  }
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Server" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(configs[label]));
    };
  };

  render() {
    return (
      <ul className="nav nav-pills">
        {Object.keys(configs).map((label, i) => {
          return (
            <li
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}
            >
              <a href="#" onClick={this.onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

function ThemeSelector({ theme, select }) {
  const themeSchema = {
    type: "string",
    enum: Object.keys(themes)
  };
  return (
    <Form
      schema={themeSchema}
      formData={theme}
      onChange={({ formData }) => select(formData, themes[formData])}
    >
      <div />
    </Form>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    // initialize state with server data
    const { schema, uiSchema, formData, validate } = configs.Server;
    this.state = {
      form: false,
      schema,
      uiSchema,
      formData,
      validate,
      editor: "default",
      theme: "paper",
      liveValidate: true,
      shareURL: null
    };
  }

  componentDidMount() {
    const hash = document.location.hash.match(/#(.*)/);
    if (hash && typeof hash[1] === "string" && hash[1].length > 0) {
      try {
        this.load(JSON.parse(atob(hash[1])));
      } catch (err) {
        alert("Unable to load form setup data.");
      }
    } else {
      this.load(configs.Server);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  load = data => {
    // Reset the ArrayFieldTemplate whenever you load new data
    const { ArrayFieldTemplate } = data;
    // force resetting form component instance
    this.setState({ form: false }, _ =>
      this.setState({ ...data, form: true, ArrayFieldTemplate })
    );
  };

  onFormDataEdited = formData => this.setState({ formData, shareURL: null });

  onThemeSelected = (theme, { stylesheet, editor }) => {
    this.setState({ theme, editor: editor ? editor : "paper" });
    setImmediate(() => {
      // Side effect!
      document.getElementById("theme").setAttribute("href", stylesheet);
    });
  };

  onFormDataChange = ({ formData }) =>
    this.setState({ formData, shareURL: null });

  render() {
    const {
      schema,
      uiSchema,
      formData,
      liveValidate,
      validate,
      theme,
      editor,
      ArrayFieldTemplate,
      transformErrors
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>react-jsonschema-form</h1>
          <div className="row">
            <div className="col-sm-8">
              <Selector onSelected={this.load} />
            </div>
            <div className="col-sm-2">
              <ThemeSelector theme={theme} select={this.onThemeSelected} />
            </div>
          </div>
        </div>
        <div className="col-sm-7">
          <Editor
            title="formData"
            theme={editor}
            code={toJson(formData)}
            onChange={this.onFormDataEdited}
          />
        </div>
        <div className="col-sm-5">
          {this.state.form && (
            <Form
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={liveValidate}
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              onChange={this.onFormDataChange}
              onSubmit={({ formData }) =>
                console.log("submitted formData", formData)}
              widgets={widgets}
              validate={validate}
              onBlur={(id, value) =>
                console.log(`Touched ${id} with value ${value}`)}
              onFocus={(id, value) =>
                console.log(`Focused ${id} with value ${value}`)}
              transformErrors={transformErrors}
              onError={log("errors")}
            >
              <div className="row">
                <div className="col-sm-3">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          )}
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
