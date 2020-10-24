const { Macros, Segments } = require("./General");

// counter to ensure unique variables.
// each time internal ROM label encountered during comparison function, add counter to make sure
// that the given line address isn't overwritten
let varCount = 0;

/**
 * Stack Arithmetic Methods
 * utilizes top (y) and second from top (x) stack items.
 * comparisons yield true (-1) or false (0)
 */
module.exports = {
  C_ARITHMETIC: {
    // x + y
    ADD: () => {
      let block = [...Macros.getTop, ...Macros.gotoTop, "M=M+D"];
      return block.join("\n");
    },

    // x - y
    SUB: () => {
      let block = [...Macros.getTop, ...Macros.gotoTop, "M=M-D"];
      return block.join("\n");
    },

    // x == y ?
    EQ: () => {
      let block = [
        ...Macros.getTop,
        ...Macros.gotoTop,
        "D=D-M",
        `@EQ_${varCount}`,
        "D;JEQ",
        "D=1",
        `(EQ_${varCount})`,
        ...Macros.gotoTop,
        "M=D-1",
      ];
      varCount++;
      return block.join("\n");
    },

    // x < y ?
    LT: () => {
      let block = [
        ...Macros.getTop,
        ...Macros.gotoTop,
        ...Macros.compare("JLT", varCount),
        ...Macros.gotoTop,
        ,
        "M=D",
      ];
      varCount++;
      return block.join("\n");
    },

    // x > y ?
    GT: () => {
      let block = [
        ...Macros.getTop,
        ...Macros.gotoTop,
        ...Macros.compare("JGT", varCount),
        ...Macros.gotoTop,
        "M=D",
      ];
      varCount++;
      return block.join("\n");
    },

    // -y
    NEG: () => {
      let block = [...Macros.getTop, "M=-D", "@SP", "M=M+1"];
      return block.join("\n");
    },

    // x & y
    AND: () => {
      let block = [...Macros.getTop, ...Macros.gotoTop, "M=D&M"];
      return block.join("\n");
    },

    // x | y
    OR: () => {
      let block = [...Macros.getTop, ...Macros.gotoTop, "M=D|M"];
      return block.join("\n");
    },

    // !y
    NOT: () => {
      let block = [...Macros.getTop, "M=!D", "@SP", "M=M+1"];
      return block.join("\n");
    },
  },

  // store element at top of stack
  C_PUSH: (seg, num, funcName) => {
    let block = [];
    let source = Segments[seg];
    if (source) {
      if (typeof source === "number") {
        block.push(
          // go to line directly since Temp, Pointer, and Static all are not preset by script.
          `@${source + parseInt(num)}`,
          "D=M"
        );
      } else if (source === "STATIC") {
        block.push(`@_${funcName}.${num}`, "D=M");
      } else {
        block.push(
          // get val to push from source at line
          `@${num}`,
          "D=A",
          `@${source}`,
          "A=D+M",
          "D=M"
        );
      }
    } else {
      // assume segment == constant in other cases
      block.push(
        // get constant num val
        `@${num}`,
        "D=A"
      );
    }
    // store the retrieved val on top of stack
    block.push(
      // go to top of stack, and store num
      ...Macros.putTop
    );
    return block.join("\n");
  },

  // remove & return top element from stack
  C_POP: (seg, num, funcName) => {
    let block = [];
    let dest = Segments[seg];
    if (typeof dest === "number") {
      block.push(
        // retrieve top element
        ...Macros.getTop,
        // move it to target segment
        `@${dest + parseInt(num)}`,
        "M=D"
      );
    } else if (dest === "STATIC") {
      block.push(...Macros.getTop, `@_${funcName}.${num}`, "M=D");
    } else {
      block.push(
        // get destination value and store for later access
        `@${num}`,
        "D=A",
        `@${dest}`,
        "D=D+M",
        "@13",
        "M=D",
        // retrieve top element
        ...Macros.getTop,
        // move it to target segment
        "@13",
        "A=M",
        "M=D"
      );
    }

    return block.join("\n");
  },
};
