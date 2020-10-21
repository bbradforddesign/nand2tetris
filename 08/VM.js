const {
  C_LABEL,
  C_IF,
  C_GOTO,
  C_FUNCTION,
  C_RETURN,
  C_CALL,
} = require("./ProgramControl");
const { C_ARITHMETIC, C_PUSH, C_POP } = require("./StackArithmetic");
const { Macros } = require("./General");
const {
  OpenMain,
  OpenSys,
  InputDir,
  InputProg,
  ResetOutput,
  CleanLine,
  WriteLine,
} = require("./Utility");

// table of keywords invoking assembly operations
const CommandType = {
  // stack operations
  add: () => C_ARITHMETIC.ADD(),
  push: (segment, num) => C_PUSH(segment, num),
  pop: (segment, num) => C_POP(segment, num),
  eq: () => C_ARITHMETIC.EQ(),
  lt: () => C_ARITHMETIC.LT(),
  gt: () => C_ARITHMETIC.GT(),
  sub: () => C_ARITHMETIC.SUB(),
  neg: () => C_ARITHMETIC.NEG(),
  and: () => C_ARITHMETIC.AND(),
  or: () => C_ARITHMETIC.OR(),
  not: () => C_ARITHMETIC.NOT(),
  // program flow/function operations
  label: (label) => C_LABEL(label),
  goto: (label) => C_GOTO(label),
  "if-goto": (label) => C_IF(label),
  function: (funcName, varCount) => C_FUNCTION(funcName, varCount),
  return: () => C_RETURN(),
  call: (funcName, varCount) => C_CALL(funcName, varCount),
};

const Bootstrap = () => {
  WriteLine(["@256", "D=A", "@SP", "M=D"].join("\n"));
  WriteLine(CommandType["call"]("Sys.init", 0));
};

const Translate = (line) => {
  const Cleaned = CleanLine(line);
  const NoSpace = Cleaned.trim();
  const Split = NoSpace.split(/[ ]+/);

  // keyword referencing an assembly operation
  let action = Split[0];

  if (action) {
    // write translated assembly operation, notating each with the supplied VM command
    if (CommandType[action]) {
      // Which memory segment? 'constant', 'local', 'static', etc.
      let segment = Split[1];
      // Which address within the given segment? ie word '3' of 'local'
      let value = Split[2];
      // pass appropriate arguments to functions returning assembly operations
      if (segment || value) {
        if (segment && !value) {
          WriteLine(`${CommandType[action](segment)} // ${Cleaned}`);
        } else if (segment && value) {
          WriteLine(`${CommandType[action](segment, value)} // ${Cleaned}`);
        }
      } else {
        // all others just need the stack, so no segment or value needed
        WriteLine(`${CommandType[action]()} // ${Cleaned}`);
      }
    } else {
      console.log(`Warning: ${action} not implemented.`);
    }
  }
};

// parse input file line by line, checking for keywords to translate
const Parse = (dir) => {
  // open init file
  const Init = OpenSys(dir);

  Init.on("line", (line) => {
    Translate(line);
  });
  // open main file

  if (InputProg) {
    const Program = OpenMain(dir, InputProg);

    Program.on("line", (line) => {
      Translate(line);
    });

    // afterwards, perform callback:
    Program.on("close", () => {
      WriteLine(Macros.terminate.join("\n"));
      console.log("done");
    });
  } else {
    Init.on("close", () => {
      WriteLine(Macros.terminate.join("\n"));
      console.log("done");
    });
  }
};

const Main = () => {
  // clear old output
  ResetOutput();
  // write bootstrap code
  Bootstrap();
  // translate VM code
  Parse(InputDir);
};

Main();
