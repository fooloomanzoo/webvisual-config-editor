import React from "react";

function processFile(files) {
  return new Promise((resolve, reject) => {
    if (files && files[0] && files[0].path) {
      resolve(files[0].path);
    }
    resolve("");
  });
}

const FileWidget = props => {
  const { options } = props;
  const { accept, directory } = options;
  return React.createElement(
    "div",
    { className: "fileselect" },
    " 📂 ",
    props.value,
    React.createElement("input", {
      type: "file",
      accept: accept,
      directory: directory,
      onChange: event => processFile(event.target.files).then(props.onChange)
    })
  );
};

export default FileWidget;
