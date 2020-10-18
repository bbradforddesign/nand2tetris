const { Macros } = require('./General')

/**
 * Program flow functions
 * handle branching logic
 */
  module.exports = {

    // creates a label address for a given line of code to be accessed later
    C_LABEL: (label) => {
        let block = [
         `(_${label})`
        ]
     
        return block.join('\n')
      },

    // creates branch to determine whether a jump should occur
      C_IF: (label) => {
        let block = [
              // if counter (should be on top of stack) > 0, jump to label
          ...Macros.getTop,
          `@_${label}`,
          'D;JGT'
        ]
      
        return block.join('\n')
       },

    // conditionless jump to given label
       C_GOTO: (label) => {
        let block = [
          `@_${label}`,
          '0;JMP'
        ]
     
        return block.join('\n')
      }
  }