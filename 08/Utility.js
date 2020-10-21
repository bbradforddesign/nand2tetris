const fs = require("fs");
const readline = require("readline");
const { Macros } = require("./General");

/**
 * Utility
 */

// allow user to select file to input/output
const Arg = process.argv.slice(2);
// folder containing the VM programs to translate
const InputDir = Arg[0];

const InputProg = Arg[1];

// name of file to output final assembly code
const OutputFile = InputDir.split("/").slice(-1) + ".asm";
// path to find output file
const OutputPath = InputDir + "/" + OutputFile;

module.exports = {
  InputDir: InputDir,
  InputProg: InputProg,

  OpenSys: (dir) => {
    const Sys = fs.createReadStream(dir + "/Sys.vm");
    return readline.createInterface({
      input: Sys,
      crlfDelay: Infinity,
    });
  },

  OpenMain: (dir, fileName) => {
    const Main = fs.createReadStream(dir + "/" + fileName);
    return readline.createInterface({
      input: Main,
      crlfDelay: Infinity,
    });
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
