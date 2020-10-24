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
  OpenClass,
  OpenSys,
  GetFiles,
  InputDir,
  ResetOutput,
  CleanLine,
  WriteLine,
} = require("./Utility");

/**
 * Main program.
 * Translates VM bytecode into corresponding assembly operations to run on the Hack platform.
 */

// table of keywords invoking assembly operations
const CommandType = {
  // stack operations
  add: () => C_ARITHMETIC.ADD(),
  push: (segment, num, funcName) => C_PUSH(segment, num, funcName),
  pop: (segment, num, funcName) => C_POP(segment, num, funcName),
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

const Translate = (line, funcName) => {
  const Cleaned = CleanLine(line);
  const NoSpace = Cleaned.trim();
  const Split = NoSpace.split(/[ ]+/);

  // keyword referencing an assembly operation
  let action = Split[0];

  if (action) {
    WriteLine(Macros.debug(NoSpace));
    // write translated assembly operation, notating each with the supplied VM command
    if (CommandType[action]) {
      // Which memory segment? 'constant', 'local', 'static', etc.
      let segment = Split[1];
      // Which address within the given segment? ie word '3' of 'local'
      let value = Split[2];
      // pass appropriate arguments to functions returning assembly operations
      if (segment || value) {
        if (segment && !value) {
          WriteLine(`${CommandType[action](segment)}`);
        } else if (segment && value) {
          if (segment === "static") {
            WriteLine(
              `${CommandType[action](segment, value, funcName.split(".")[0])}`
            );
          } else {
            WriteLine(`${CommandType[action](segment, value)}`);
          }
        }
      } else {
        // all others just need the stack, so no segment or value needed
        WriteLine(`${CommandType[action]()}`);
      }
    } else {
      console.log(`Warning: ${action} not implemented.`);
    }
  }
};

const Close = () => {
  WriteLine("\n//closing loop\n" + Macros.terminate.join("\n"));
  console.log("Done!");
};

// parse input file line by line, checking for keywords to translate
const Parse = (dir) => {
  const files = GetFiles(dir);
  // open init file. called separately to ensure it's translated first
  const Init = OpenSys(dir);
  const Classes = files.filter((e) => e.toLowerCase() !== "sys.vm");

  Init.forEach((line) => {
    Translate(line, "Init");
  });

  // open main file
  for (let i = 0; i < Classes.length; i++) {
    const Program = OpenClass(dir, Classes[i]);

    Program.forEach((line) => {
      Translate(line, Classes[i]);
    });

    console.log(`${Classes[i]} translated.`);
  }

  Close();
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
