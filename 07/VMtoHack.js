const fs = require("fs");
const readline = require("readline");

/**
 * Utility
 */

// allow user to select file to input/output
const Arg = process.argv.slice(2);
const InputFile = Arg[0];
const OutputFile = InputFile.slice(0, -3) + ".asm";

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
 * Main modules
 */

// counter to ensure unique variables.
// each time ROM label encountered, add counter to make sure
// that the given line address isn't overwritten
let varCount = 0;

// store element at top of stack
const C_PUSH = (num) => {
  let block = [
    // get num's val
    `@${num}`,
    "D=A",
    // go to top of stack, and store num
    "@SP",
    "M=M+1",
    "A=M-1",
    "M=D",
  ];

  return block.join("\n");
};

// remove & return top element from stack
const C_POP = () => {
  let block = [
    // retrieve top element
    "@SP",
    "M=M-1",
    "A=M",
    "D=M",
  ];

  return block.join("\n");
};

// stack arithmetic methods

// add top two stack elements together
const Add = () => {
  let block = [C_POP(), "@SP", "M=M-1", "A=M", "M=M+D"];

  return block.join("\n");
};

// check equality of top two stack elements
const Eq = () => {
  let block = [
    C_POP(),
    "@SP",
    "AM=M-1",
    "D=D-M",
    /**
     * desired behavior
     *
     * if D !== 0 push 0
     * else push -1
     *
     */
    `@EQ_${varCount}`,
    "D;JEQ",
    "D=1",
    `(EQ_${varCount})`,
    "@SP",
    "A=M",
    "M=D-1",
    "@SP",
    "M=M+1",
  ];
  varCount++;
  return block.join("\n");
};

const Lt = () => {
  let block = [
    C_POP(),
    "@SP",
    "AM=M-1",
    "D=M-D",
    `@LT_${varCount}`,
    "D;JLT",
    `@GT_${varCount}`,
    "0;JMP",
    `(LT_${varCount})`,
    "D=-1",
    `@STORE_${varCount}`,
    "0;JMP",
    `(GT_${varCount})`,
    "D=0",
    `(STORE_${varCount})`,
    "@SP",
    "A=M",
    "M=D",
    "@SP",
    "M=M+1",
  ];
  varCount++;
  return block.join("\n");
};

const Gt = () => {
  let block = [
    C_POP(),
    "@SP",
    "AM=M-1",
    "D=M-D",
    `@LT_${varCount}`,
    "D;JLT",
    `@GT_${varCount}`,
    "0;JMP",
    `(LT_${varCount})`,
    "D=0",
    `@STORE_${varCount}`,
    "0;JMP",
    `(GT_${varCount})`,
    "D=-1",
    `(STORE_${varCount})`,
    "@SP",
    "A=M",
    "M=D",
    "@SP",
    "M=M+1",
  ];
  varCount++;
  return block.join("\n");
};

const C_ARITHMETIC = {
  ADD: () => Add(),
  EQ: () => Eq(),
  LT: () => Lt(),
  GT: () => Gt(),
};

// command type table
const CommandType = {
  add: () => C_ARITHMETIC.ADD(),
  push: (num) => C_PUSH(num),
  pop: () => C_POP(),
  eq: () => C_ARITHMETIC.EQ(),
  lt: () => C_ARITHMETIC.LT(),
  gt: () => C_ARITHMETIC.GT(),
  C_LABEL: "",
  C_GOTO: "",
  C_IF: "",
  C_FUNCTION: "",
  C_RETURN: "",
  C_CALL: "",
};

// parse input file to perform basic stack arithmetic
const Parse = (fileAddress) => {
  // clear old output
  resetOutput();
  // open file
  const rl = OpenFile(fileAddress);
  rl.on("line", (line) => {
    const Cleaned = CleanLine(line);
    const NoSpace = Cleaned.trim();
    const Split = NoSpace.split(/[ ]+/);
    // if push command, add target val to stack
    if (CommandType[Split[0]]) {
      WriteLine(`${CommandType[Split[0]](Split[2])} // ${line}`);
    }
  });

  // afterwards, perform callback:
  rl.on("close", () => {
    console.log("done");
  });
};

Parse(InputFile);
