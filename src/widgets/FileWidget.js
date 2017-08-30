import React, { Component } from "react";

import { shouldRender, setState } from "../utils";

function processFile(file) {
  return new Promise((resolve, reject) => {
    console.log(file);
    if (file && file.path) {
      resolve(file.path);
    }
    resolve("");
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const { values } = props;
  if (values.length === 0) {
    return null;
  }
  return (
    <ul className="file-info">
      {values.map((path, index) => {
        return (
          <li key={index}>
            <strong>{path}</strong>
          </li>
        );
      })}
    </ul>
  );
}

class FileWidget extends Component {
  defaultProps = {
    multiple: false
  };

  constructor(props) {
    super(props);
    const { value } = props;
    const values = Array.isArray(value) ? value : [value];
    this.state = { value, values };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  componentDidMount() {
    if (this.inputRef) {
      if (this.props.options.directory) {
        this.inputRef.setAttribute("webkitdirectory", true);
      } else if (this.inputRef.hasAttribute("webkitdirectory")) {
        this.inputRef.removeAttribute("webkitdirectory");
      }
    }
  }

  onChange = event => {
    const { multiple, onChange } = this.props;
    processFiles(event.target.files).then(files => {
      const state = {
        value: files[0],
        values: files
      };
      setState(this, state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  render() {
    const { multiple, accept, id, readonly, disabled, autofocus } = this.props;
    const { values } = this.state;
    return (
      <div>
        <label className="btn btn-default btn-file">
          <input
            ref={ref => (this.inputRef = ref)}
            id={id}
            type="file"
            disabled={readonly || disabled}
            onChange={this.onChange}
            defaultValue=""
            autoFocus={autofocus}
            multiple={multiple}
            accept={accept}
          />
        </label>
        <FilesInfo values={values} />
      </div>
    );
  }
}

FileWidget.defaultProps = {
  autofocus: false
};

//
//
// const FileWidget = props => {
//   const { options } = props;
//   const { accept, directory } = options;
//   return React.createElement(
//     "div",
//     { className: "fileselect" },
//     " 📂 ",
//     props.value,
//     React.createElement("input", {
//       type: "file",
//       accept: accept,
//       webkitdirectory: directory,
//       onChange: event => processFile(event.target.files).then(props.onChange)
//     })
//   );
// };

export default FileWidget;
