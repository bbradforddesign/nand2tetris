@3030
D=A
@SP
M=M+1
A=M-1
M=D // push constant 3030
@SP
AM=M-1
D=M
@3
M=D // pop pointer 0
@3040
D=A
@SP
M=M+1
A=M-1
M=D // push constant 3040
@SP
AM=M-1
D=M
@4
M=D // pop pointer 1
@32
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32
@2
D=A
@THIS
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop this 2
@46
D=A
@SP
M=M+1
A=M-1
M=D // push constant 46
@6
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
M=D // pop that 6
@3
D=M
@SP
M=M+1
A=M-1
M=D // push pointer 0
@4
D=M
@SP
M=M+1
A=M-1
M=D // push pointer 1
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
@2
D=A
@THIS
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push this 2
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D // sub
@6
D=A
@THAT
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push that 6
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
(END)
@END
0;JMP
