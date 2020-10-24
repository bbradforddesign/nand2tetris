const fs = require("fs");
const path = require("path");

/**
 * Utility functions.
 * Allow our main program to access the input files, and modify the output file.
 */

// allow user to select file to input/output
const Arg = process.argv.slice(2);
// folder containing the VM programs to translate
const InputDir = Arg[0];

const InputProg = Arg[1];

/**
 * search directory for files with extension
 * var targetFiles = files.filter(function(file) {
    return path.extname(file).toLowerCase() === EXTENSION;
}); 
 */

// name of file to output final assembly code
const OutputFile = InputDir.split("/").slice(-1) + ".asm";
// path to find output file
const OutputPath = InputDir + "/" + OutputFile;

module.exports = {
  InputDir: InputDir,
  InputProg: InputProg,

  GetFiles: (dir) => {
    // note: Should call filter as callback in readdir?
    // when done that way, returns undefined. async?
    const list = fs.readdirSync(dir);
    return list.filter((e) => path.extname(e) === ".vm");
  },

  OpenSys: (dir) => {
    const Sys = fs.readFileSync(dir + "/Sys.vm", "utf-8");
    return Sys.split("\n").filter(Boolean);
  },

  OpenClass: (dir, fileName) => {
    const Class = fs.readFileSync(dir + "/" + fileName, "utf-8");
    return Class.split("\n").filter(Boolean);
  },

  ResetOutput: () => {
    if (fs.existsSync(OutputPath)) {
      console.log("Output file already exists. Overwriting.");
      fs.truncateSync(OutputPath, 0, (err) => {
        if (err) return console.log(err);
      });
    }
  },

  CleanLine: (line) => {
    if (line.includes("/")) {
      return line.substring(0, line.indexOf("/"));
    }
    return line;
  },

  WriteLine: (line) => {
    fs.appendFileSync(OutputPath, line + "\n", (err) => {
      if (err) return console.log(err);
    });
  },
};
