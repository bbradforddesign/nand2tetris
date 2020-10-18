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
 * Main functions
 */

// counter to ensure unique variables.
// each time ROM label encountered, add counter to make sure
// that the given line address isn't overwritten
let varCount = 0;


// pointers to bases of memory segments.
// NOTE: pointers with strings are initialized at runtime. pointers with number addresses are predefined.
const Segments = {
  sp: 'SP',
  local: 'LCL',
  argument: 'ARG',
  this: 'THIS',
  that: 'THAT',
  temp: 5,
  pointer: 3,
  static: 16
}

// assembly code presets for readability
const Macros = {
  getTop: ["@SP",
  "AM=M-1",
  "D=M",],
  putTop: ["@SP",
  "M=M+1",
  "A=M-1",
  "M=D",],
  gotoTop: ["@SP", 
  "A=M-1", ],
  terminate: ["(END)",
  "@END",
  "0;JMP"],
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
    if (typeof(source) === 'number') {
      block.push(
        // go to line directly since Temp, Pointer, and Static all are not preset by script.
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
  if (typeof(dest) === 'number') {
    block.push(
    // retrieve top element
    ...Macros.getTop,
    // move it to target segment
    `@${dest + parseInt(num)}`,
    'M=D'
    )
  } else {
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


/**
 * Stack Arithmetic Methods
 * utilizes top (y) and second from top (x) stack items.
 * comparisons yield true (-1) or false (0)
 */ 
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
      ...Macros.gotoTop,,
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

/**
 * Program flow functions
 * handle branching logic
 */

 // creates a label address for a given line of code to be accessed later
 const C_LABEL = (label) => {
   let block = [
    `(_${label})`
   ]

   return block.join('\n')
 }

 // creates branch to determine whether a jump should occur
 const C_IF = (label) => {
  let block = [
        // if counter (should be on top of stack) > 0, jump to label
    ...Macros.getTop,
    `@_${label}`,
    'D;JGT'
  ]

  return block.join('\n')
 }

 // conditionless jump to given label
 const C_GOTO = (label) => {
   let block = [
     `@_${label}`,
     '0;JMP'
   ]

   return block.join('\n')
 }

// table of keywords invoking assembly operations
const CommandType = {
  // stack operations
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
  // program flow/function operations
  label: (label) => C_LABEL(label),
  goto: (label) => C_GOTO(label),
  'if-goto': (label) => C_IF(label),
  C_FUNCTION: "",
  C_RETURN: "",
  C_CALL: "",
};


// parse input file line by line, checking for keywords to translate
const Parse = (fileAddress) => {
  // clear old output
  resetOutput();
  // open file
  const rl = OpenFile(fileAddress);

  rl.on("line", (line) => {
    const Cleaned = CleanLine(line);
    const NoSpace = Cleaned.trim();
    const Split = NoSpace.split(/[ ]+/);
    
    // keyword referencing an assembly operation
    let action = Split[0]
    
    if (action) {
      // write translated assembly operation, notating each with the supplied VM command
      if (CommandType[action]) {
        // Which memory segment? 'constant', 'local', 'static', etc.
        let segment = Split[1];
        // Which address within the given segment? ie word '3' of 'local'
          let value = Split[2];
        if (segment || value){
          // assume program flow command if just segment supplied
          if (segment && !value) {
            WriteLine(`${CommandType[action](segment)} // ${Cleaned}`);
          } else if (segment && value) {
            // assume push or pop method if segment and value supplied
            WriteLine(`${CommandType[action](segment,value)} // ${Cleaned}`);
          }
        } else {
          // all others just need the stack, so no segment or value needed
          WriteLine(`${CommandType[action]()} // ${Cleaned}`);
        }
      } else {
        console.log(`Warning: ${action} not implemented.`)
      }
    }
  });

  // afterwards, perform callback:
  rl.on("close", () => {
    WriteLine(Macros.terminate.join('\n'))
    console.log("done");
  });
};

Parse(InputFile);
