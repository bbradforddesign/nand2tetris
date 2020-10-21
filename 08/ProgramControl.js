const { Macros } = require("./General");

/**
 * Program flow functions
 * handle branching logic
 */

let unique = 0;
module.exports = {
  // creates a label address for a given line of code to be accessed later
  C_LABEL: (label) => {
    let block = [`(_${label})`];

    return block.join("\n");
  },

  // creates branch to determine whether a jump should occur
  C_IF: (label) => {
    let block = [
      // if counter (should be on top of stack) !== 0, jump to label
      ...Macros.getTop,
      `@_${label}`,
      "D;JNE",
    ];

    return block.join("\n");
  },

  // conditionless jump to given label
  C_GOTO: (label) => {
    let block = [`@_${label}`, "0;JMP"];

    return block.join("\n");
  },

  // declare function of x variables
  C_FUNCTION: (funcName, varCount) => {
    // create label funcName
    let block = [`(_${funcName})`];
    // push 0 varCount times
    let push0 = ["@0", "D=A", ...Macros.putTop];
    for (let i = 0; i < varCount; i++) {
      block.push(...push0);
    }

    return block.join("\n");
  },

  // call a function
  C_CALL: (funcName, varCount) => {
    unique++;
    let block = [
      // push return-address
      `@RET_${unique}`,
      "D=A",
      ...Macros.putTop,
      // push LCL
      "@LCL",
      "D=M",
      ...Macros.putTop,
      // push ARG
      "@ARG",
      "D=M",
      ...Macros.putTop,
      // push THIS
      "@THIS",
      "D=M",
      ...Macros.putTop,
      // push THAT
      "@THAT",
      "D=M",
      ...Macros.putTop,
      // ARG = SP - args count - 5
      "@5",
      "D=A",
      "@SP",
      "D=M-D",
      `@${varCount}`,
      "D=D-A",
      "@ARG",
      "M=D",
      // LCL = SP
      "@SP",
      "D=M",
      "@LCL",
      "M=D",
      // goto f
      `@_${funcName}`,
      "0;JMP",
      // (return-address)
      `(RET_${unique})`,
    ];
    return block.join("\n");
  },

  // return from a function
  C_RETURN: () => {
    let block = [
      // frame = lcl
      "@LCL",
      "D=M",
      "@R14",
      "M=D",
      // return address = *(frame -5)
      "@5",
      "D=A",
      "@R14",
      "D=M-D",
      "A=D",
      "D=M",
      // note: MUST STORE RESULT IN R15
      "@R15",
      "M=D",
      // pop top of arg
      ...Macros.getTop,
      "@ARG",
      "A=M",
      // note: MUST STORE POPPED VALUE AT ADDRESS REFD BY ARG
      "M=D",
      // SP = ARG + 1
      "@ARG",
      "D=M+1",
      "@SP",
      "M=D",
      // restore THAT
      ...Macros.restore("THAT"),
      // restore THIS
      ...Macros.restore("THIS"),
      // restore ARG
      ...Macros.restore("ARG"),
      // restore LCL
      ...Macros.restore("LCL"),
      // goto return address
      `@R15`,
      "A=M",
      "0;JMP",
    ];

    return block.join("\n");
  },
};
