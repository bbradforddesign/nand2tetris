// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// zero result
  @0
  D=A // load 0
  @R2
  M=D // R2 = 0

  @R0
  D=M // load R0
  @END
  D;JEQ // if R0 == 0, end
  @test
  M=D // store R0 to compare
  @R1
  D=M // load R1
  @END
  D;JEQ // if R1 == 0, end
  @test
  D=D-M // test = R1 - R0
  @R0GREATER
  D;JLE
  @R1GREATER
  D;JGT

 (R0GREATER) // if R0 is greater, set it as the increment
  @R0
  D=M
  @increment
  M=D
  @R1
  D=M
  @counter
  M=D
  @LOOP
  0;JMP // goto LOOP

 (R1GREATER) // if R1 is greater, set it as the increment
  @R1
  D=M
  @increment
  M=D
  @R0
  D=M
  @counter
  M=D
  @LOOP
  0;JMP // goto LOOP

// loop body
(LOOP)
  @counter
  D=M // load counter
  @END
  D;JEQ // if D=0, goto END
  @increment
  D=M // load increment
  @R2
  M=D+M // R2 = increment + R2
  @counter
  M=M-1 // counter=counter-1
  @LOOP
  0;JMP // goto LOOP
(END)
  @END
  0;JMP // end program
