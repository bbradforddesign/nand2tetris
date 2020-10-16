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


// RAM addresses
const Segments = {
  // pointer to next topmost location
  sp: 'SP',
  // pointer to base of current function's local
  local: 'LCL',
  // base of function's argument segment
  argument: 'ARG',
  // base of current this segment
  this: 'THIS',
  // base of current that segment
  that: 'THAT',
  // base of temp segment
  temp: 5
}

// assembly code presets for readability
const Macros = {
  getTop: ["@SP",
  "M=M-1",
  "A=M",
  "D=M",],
  putTop: ["@SP",
  "M=M+1",
  "A=M-1",
  "M=D",],
  gotoTop: ["@SP", 
  "A=M-1", ],
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
    ]
  }
}

// store element at top of stack
const C_PUSH = (seg,num) => {
  let block = []
  let source = Segments[seg]
  if (source) {
    if (source === 5) {
      block.push(
        // go to line directly since 'TEMP' doesn't have a pointer
        `@${source + parseInt(num)}`,
        "D=M"
      )
    } else { 
      block.push(
      // get val to push from source at line
      `@${num}`,
      "D=A",
      `@${source}`,
      "A=D+M",
      "D=M",
    )
      }
  } else {
    // assume segment == constant in other cases
    block.push(
      // get constant num val
    `@${num}`,
    "D=A",
    )
  }
  // store the retrieved val on top of stack
  block.push(
    // go to top of stack, and store num
    ...Macros.putTop
  )
  return block.join("\n");
};

// remove & return top element from stack
const C_POP = (seg,num) => {
  let block = []
  let dest = Segments[seg]
  if (dest === 'TEMP') {
    dest = 5 + parseInt(num);
    block.push(
    // retrieve top element
    ...Macros.getTop
    // move it to target segment
    `@${dest}`,
    'M=D'
    )
  }
  else {
    block.push(
      // get destination value and store for later access
    `@${num}`,
    "D=A",
    `@${dest}`,
    'D=D+M',
    '@13',
    "M=D",
    // retrieve top element
    ...Macros.getTop,
    // move it to target segment
    '@13',
    'A=M',
    'M=D'
    )
  }

  return block.join("\n");
};


// stack arithmetic methods.
// utilizes top (y) and second from top (x) stack items.
// comparisons yield true (-1) or false (0)

// TODO: possible optimization is to 
// only declare one gt,lt,eq comparison, and call them as functions.
// would be less lines, but slower?
const C_ARITHMETIC = {
  // x + y
  ADD: () => {
    let block = [
      ...Macros.getTop,
      ...Macros.gotoTop, 
      "M=M+D"
    ]
    return block.join("\n");
  },
  // x - y
  SUB: () => {
    let block = [
      ...Macros.getTop,
      ...Macros.gotoTop,
      "M=M-D"
    ]
    return block.join('\n')
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
      ...Macros.compare('JLT',varCount),
      ...Macros.gotoTop,
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
      ...Macros.compare('JGT',varCount),
      ...Macros.gotoTop,
      "M=D",
    ];
    varCount++;
    return block.join("\n");
  },
  // -y
  NEG: () => {
    let block = [
      ...Macros.getTop,
      "M=-D",
      "@SP",
      "M=M+1"
    ];
    return block.join("\n")
  },
  // x & y
  AND: () => {
    let block = [
      ...Macros.getTop,
      ...Macros.gotoTop,
      "M=D&M"
    ];
    return block.join("\n")
  },
  // x | y
  OR: () => {
    let block = [
      ...Macros.getTop,
      ...Macros.gotoTop,
      "M=D|M"
    ]
    return block.join("\n")
  },
  // !y
  NOT: () => {
    let block = [
      ...Macros.getTop,
      "M=!D",
      "@SP",
      "M=M+1"
    ]
    return block.join('\n')
  }
};

// command type table
const CommandType = {
  add: () => C_ARITHMETIC.ADD(),
  push: (segment,num) => C_PUSH(segment,num),
  pop: (segment,num) => C_POP(segment,num),
  eq: () => C_ARITHMETIC.EQ(),
  lt: () => C_ARITHMETIC.LT(),
  gt: () => C_ARITHMETIC.GT(),
  sub: () => C_ARITHMETIC.SUB(),
  neg: () => C_ARITHMETIC.NEG(),
  and: () => C_ARITHMETIC.AND(),
  or: () => C_ARITHMETIC.OR(),
  not: () => C_ARITHMETIC.NOT(),
  C_LABEL: "",
  C_GOTO: "",
  C_IF: "",
  C_FUNCTION: "",
  C_RETURN: "",
  C_CALL: "",
};

// end loop
const EndLoop = [
  "(END)",
  "@END",
  "0;JMP"
]

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
    
    // determine which segment to access on push
    let action = Split[0]
    // if push command, add target val to stack
    if (CommandType[action]) {
      let segment = Split[1];
        let value = Split[2];
      if (segment || value){
        // assume push or pop method if segment and value supplied
        WriteLine(`${CommandType[action](segment,value)} // ${line}`);
      } else {
        // all others just need the stack, so no segment or value
        WriteLine(`${CommandType[action]()} // ${line}`);
      }
    }
  });

  // afterwards, perform callback:
  rl.on("close", () => {
    WriteLine(EndLoop.join('\n'))
    console.log("done");
  });
};

Parse(InputFile);
