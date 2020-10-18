const fs = require("fs");
const readline = require("readline");

/**
 * Utility
 */

// allow user to select file to input/output
const Arg = process.argv.slice(2);
const InputFile = Arg[0];
const OutputFile = InputFile.slice(0, -3) + ".asm";


module.exports = {

    InputFile: InputFile,

    OpenFile: (file) => {
        const fileStream = fs.createReadStream(file);
        return readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });
      },

      ResetOutput: () => {
        if (fs.existsSync(OutputFile)) {
          console.log("Output file already exists. Overwriting.");
          fs.truncate(OutputFile, 0, (err) => {
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
        fs.appendFileSync(OutputFile, line + "\n", (err) => {
          if (err) return console.log(err);
        });
      }
}