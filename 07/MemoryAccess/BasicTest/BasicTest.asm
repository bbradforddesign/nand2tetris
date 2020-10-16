@14
D=A
@SP
M=M+1
A=M-1
M=D // push constant 14
@14
D=A
@SP
M=M+1
A=M-1
M=D // push constant 14
@SP
M=M-1
A=M
D=M
@SP
A=M-1
D=D-M
@EQ_0
D;JEQ
D=1
(EQ_0)
@SP
A=M-1
M=D-1 // eq
(END)
@END
0;JMP
