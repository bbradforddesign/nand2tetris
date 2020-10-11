const fs = require("fs");
const readline = require("readline");

// allow user to select file to input/output
const Arg = process.argv.slice(2);
const InputFile = Arg[0];
const OutputFile = InputFile.slice(0, -4) + ".hack";

// global variables for storing/accessing data
const CompTable = {
  0: "0101010",
  1: "0111111",
  "-1": "0111010",
  D: "0001100",
  A: "0110000",
  M: "1110000",
  "!D": "0001101",
  "!A": "0110001",
  "!M": "1110001",
  "-D": "0001111",
  "-A": "0110011",
  "-M": "1110011",
  "D+1": "0011111",
  "A+1": "0110111",
  "M+1": "1110111",
  "D-1": "0001110",
  "A-1": "0110010",
  "M-1": "1110010",
  "D+A": "0000010",
  "D+M": "1000010",
  "D-A": "0010011",
  "D-M": "1010011",
  "A-D": "0000111",
  "M-D": "1000111",
  "D&A": "0000000",
  "D&M": "1000000",
  "D|A": "0010101",
  "D|M": "1010101",
};

const JumpTable = {
  JGT: "001",
  JEQ: "010",
  JGE: "011",
  JLT: "100",
  JNE: "101",
  JLE: "110",
  JMP: "111",
};

const DestTable = {
  M: "001",
  D: "010",
  MD: "011",
  A: "100",
  AM: "101",
  AD: "110",
  AMD: "111",
};

let lineCount = 0;
let available = 16;

const SymbolTable = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SCREEN: 16384,
  KBD: 24576,
};

const ValidC = ["A", "D", "M", "0"];
// end global variables

/**
 * Utility functions
 *
 */

// open source file routine
const OpenFile = (file) => {
  const fileStream = fs.createReadStream(file);
  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
};

// wipe output file if one exists
const resetOutput = () => {
  if (fs.existsSync(OutputFile)) {
    console.log("Output file already exists. Overwriting.");
    fs.truncate(OutputFile, 0, (err) => {
      if (err) return console.log(err);
    });
  }
};

// remove comments
const CleanLine = (line) => {
  if (line.includes("/")) {
    return line.substring(0, line.indexOf("/"));
  }
  return line;
};

// function writing new line to file.
const WriteLine = (line) => {
  fs.appendFileSync(OutputFile, line + "\n", (err) => {
    if (err) return console.log(err);
  });
};

/**
 *
 * Assembly functions
 */

// command type detection routine
const commandType = (command) => {
  if (command[0] === "(" && command[command.length - 1] === ")") {
    return "L_COMMAND";
  } else if (command[0] === "@") {
    return "A_COMMAND";
  } else if (ValidC.includes(command[0])) {
    return "C_COMMAND";
  } else {
    throw new Error(`Invalid command on line ${lineCount}`);
  }
};

// C-command subroutine
const parseCCommand = (line) => {
  // base of binary command
  let parsedLine = "111";

  // vars to hold substrings of line
  let Assignment = line.indexOf("=");
  let Jump = line.indexOf(";");

  // determine Comp command. If ';' is present, determine Jump command as well.
  // if '=' is present, determine dest command to store assignment.
  if (line.includes("=")) {
    parsedLine += CompTable[line.substring(Assignment + 1)];
    parsedLine += DestTable[line.slice(0, Assignment)];
    parsedLine += "000";
  } else if (line.includes(";")) {
    parsedLine += CompTable[line.slice(0, Jump)];
    parsedLine += "000";
    parsedLine += JumpTable[line.substring(Jump + 1)];
  }

  // if cleaned line not blank, create entry
  line !== "" ? WriteLine(parsedLine) : null;
};

// convert A command to binary address
const ConvertBinary = (toConvert) => {
  let address = parseInt(toConvert).toString(2);
  while (address.length < 16) {
    address = "0" + address;
  }
  return address;
};

// A-command subroutine
const parseACommand = (A) => {
  // extract address from command
  const Address = A.substring(1);
  // check if address is numerical
  let isNumber = /^\d+$/.test(Address);
  if (isNumber) {
    WriteLine(ConvertBinary(Address));
  } else {
    // check if symbol exists
    if (SymbolTable[Address] || Address === "SP") {
      WriteLine(ConvertBinary(SymbolTable[Address]));
    } else {
      SymbolTable[Address] = available;
      WriteLine(ConvertBinary(available));
      available++;
    }
  }
};

// first pass; build symbol table
const Parse = (fileAddress) => {
  // open file
  const rl = OpenFile(fileAddress);
  rl.on("line", (line) => {
    const Cleaned = CleanLine(line);
    const NoSpace = Cleaned.trim();
    if (
      commandType(NoSpace) === "C_COMMAND" ||
      commandType(NoSpace) === "A_COMMAND"
    ) {
      lineCount++;
    } else if (commandType(NoSpace) === "L_COMMAND") {
      SymbolTable[NoSpace.slice(1, NoSpace.length - 1)] = lineCount;
    }
  });

  // callback to perform second pass
  rl.on("close", () => {
    Assemble(fileAddress);
  });
};

// second pass; translate assembly to binary
const Assemble = (fileAddress) => {
  // open source file
  const rl = OpenFile(fileAddress);
  rl.on("line", (line) => {
    const Cleaned = CleanLine(line);
    const NoSpace = Cleaned.trim();
    if (commandType(NoSpace) === "C_COMMAND") {
      parseCCommand(NoSpace);
    } else if (commandType(NoSpace) === "A_COMMAND") {
      parseACommand(NoSpace);
    }
  });
  // callback to let user know that assembly is complete.
  rl.on("close", () => {
    console.log(`${lineCount} lines assembled`);
  });
};

// let user know which process is underway.
console.log("Checking for previous output.");
resetOutput();
console.log("Parsing code. Please wait.");
Parse(InputFile);
