@111
D=A
@SP
M=M+1
A=M-1
M=D // push constant 111
@333
D=A
@SP
M=M+1
A=M-1
M=D // push constant 333
@888
D=A
@SP
M=M+1
A=M-1
M=D // push constant 888
@SP
AM=M-1
D=M
@24
M=D // pop static 8
@SP
AM=M-1
D=M
@19
M=D // pop static 3
@SP
AM=M-1
D=M
@17
M=D // pop static 1
@19
D=M
@SP
M=M+1
A=M-1
M=D // push static 3
@17
D=M
@SP
M=M+1
A=M-1
M=D // push static 1
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D // sub
@24
D=M
@SP
M=M+1
A=M-1
M=D // push static 8
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
(END)
@END
0;JMP
