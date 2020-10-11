// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

(START) // reset step
  @8191
  D=A  
  @counter
  M=D // set counter to highest screen mem register
  @SCREEN
  D=A
  @pixel
  M=D // set pixel address to beginning
  @KBD
  D=M
  @FILL
  D;JGT // if key pressed, goto FILL
(CLEAR) // clear step
  @pixel
  D=M
  A=D // go to pixel's address
  M=0 // set that address' val to 0  
  @counter
  D=M
  M=D-1 // decrement counter
  @START
  D;JEQ // if counter equals 0, reset
  @pixel
  D=M
  M=D+1 // increment pixel address
  @KBD
  D=M
  @START
  D;JGT // if key pressed, reset
  @CLEAR
  0;JMP // else, clear again
(FILL) // fill step
  @pixel
  D=M
  A=D // goto pixel address
  M=-1 // fill pixel
  @counter
  D=M
  M=D-1 // decrement counter
  @START
  D;JEQ // if counter equals 0, reset
  @pixel
  D=M
  M=D+1 // increment pixel address
  @KBD
  D=M
  @START
  D;JEQ // if key released, reset
  @FILL
  0;JMP // else, fill again
