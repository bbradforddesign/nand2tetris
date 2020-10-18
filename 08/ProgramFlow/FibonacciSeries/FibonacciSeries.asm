@1
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push argument 1
@SP
AM=M-1
D=M
@4
M=D // pop pointer 1           
@0
D=A
@SP
M=M+1
A=M-1
M=D // push constant 0
@0
D=A
@THAT
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop that 0              
@1
D=A
@SP
M=M+1
A=M-1
M=D // push constant 1
@1
D=A
@THAT
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop that 1              
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push argument 0
@2
D=A
@SP
M=M+1
A=M-1
M=D // push constant 2
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D // sub
@0
D=A
@ARG
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop argument 0          
(_MAIN_LOOP_START) // label MAIN_LOOP_START
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push argument 0
@SP
AM=M-1
D=M
@_COMPUTE_ELEMENT
D;JGT // if-goto COMPUTE_ELEMENT 
@_END_PROGRAM
0;JMP // goto END_PROGRAM        
(_COMPUTE_ELEMENT) // label COMPUTE_ELEMENT
@0
D=A
@THAT
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push that 0
@1
D=A
@THAT
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push that 1
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
@2
D=A
@THAT
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop that 2              
@4
D=M
@SP
M=M+1
A=M-1
M=D // push pointer 1
@1
D=A
@SP
M=M+1
A=M-1
M=D // push constant 1
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
@SP
AM=M-1
D=M
@4
M=D // pop pointer 1           
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push argument 0
@1
D=A
@SP
M=M+1
A=M-1
M=D // push constant 1
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D // sub
@0
D=A
@ARG
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop argument 0          
@_MAIN_LOOP_START
0;JMP // goto MAIN_LOOP_START
(_END_PROGRAM) // label END_PROGRAM
(END)
@END
0;JMP
