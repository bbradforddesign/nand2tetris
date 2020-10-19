const { Macros } = require("./General");

/**
 * Program flow functions
 * handle branching logic
 */
module.exports = {
  // creates a label address for a given line of code to be accessed later
  C_LABEL: (label) => {
    let block = [`(_${label})`];

    return block.join("\n");
  },

  // creates branch to determine whether a jump should occur
  C_IF: (label) => {
    let block = [
      // if counter (should be on top of stack) > 0, jump to label
      ...Macros.getTop,
      `@_${label}`,
      "D;JGT",
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

  // return from a function
  C_RETURN: () => {
    let block = [
      // frame = lcl
      "@LCL",
      "D=M",
      "@FRAME",
      "M=D",
      // return address = *(frame -5)
      "@5",
      "D=A",
      "@FRAME",
      "D=M-D",
      "@RET",
      "M=D",
      // pop top of arg
      ...Macros.getTop,
      "@ARG",
      "A=M",
      "M=D",
      // restore SP
      "@ARG",
      "D=M",
      "@SP",
      "M=D+1",
      // restore THAT
      ...Macros.restore("THAT"),
      // restore THIS
      ...Macros.restore("THIS"),
      // restore ARG
      ...Macros.restore("ARG"),
      // restore LCL
      ...Macros.restore("LCL"),
    ];

    return block.join("\n");
  },
};
