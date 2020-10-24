/**
 * General tables used by multiple functions and processes
 */
module.exports = {
  // pointers to bases of memory segments.
  // NOTE: pointers with strings are built-in on the Hack platform, and require no definition on our end.
  Segments: {
    sp: "SP",
    local: "LCL",
    argument: "ARG",
    this: "THIS",
    that: "THAT",
    temp: 5,
    pointer: 3,
    static: "STATIC",
  },

  // assembly code presets for readability
  Macros: {
    getTop: ["@SP", "AM=M-1", "D=M"],
    putTop: ["@SP", "M=M+1", "A=M-1", "M=D"],
    gotoTop: ["@SP", "A=M-1"],
    debug: (actionName) => {
      return `\n//${actionName}`;
    },
    restore: (pointer) => {
      return ["@R14", "MD=M-1", "A=D", "D=M", `@${pointer}`, "M=D"];
    },
    terminate: ["(END)", "@END", "0;JMP"],
    compare: (comparison, iterator) => {
      return [
        "D=M-D",
        `@LT_${iterator}`,
        `D;${comparison}`,
        `@GT_${iterator}`,
        "0;JMP",
        `(LT_${iterator})`,
        "D=-1",
        `@STORE_${iterator}`,
        "0;JMP",
        `(GT_${iterator})`,
        "D=0",
        `(STORE_${iterator})`,
      ];
    },
  },
};
