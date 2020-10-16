@10
D=A
@SP
M=M+1
A=M-1
M=D // push constant 10
@0
D=A
@LCL
D=D+M
@13
M=D
@SP
AM=M-1
D=M
@13
A=M
M=D // pop local 0
@21
D=A
@SP
M=M+1
A=M-1
M=D // push constant 21
@22
D=A
@SP
M=M+1
A=M-1
M=D // push constant 22
@2
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
M=D // pop argument 2
@1
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
M=D // pop argument 1
@36
D=A
@SP
M=M+1
A=M-1
M=D // push constant 36
@6
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
M=D // pop this 6
@42
D=A
@SP
M=M+1
A=M-1
M=D // push constant 42
@45
D=A
@SP
M=M+1
A=M-1
M=D // push constant 45
@5
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
M=D // pop that 5
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
@510
D=A
@SP
M=M+1
A=M-1
M=D // push constant 510
@SP
AM=M-1
D=M
@11
M=D // pop temp 6
@0
D=A
@LCL
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push local 0
@5
D=A
@THAT
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push that 5
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
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
@SP
A=M-1
M=M-D // sub
@6
D=A
@THIS
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push this 6
@6
D=A
@THIS
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push this 6
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D // sub
@11
D=M
@SP
M=M+1
A=M-1
M=D // push temp 6
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
(END)
@END
0;JMP
