@256
D=A
@SP
M=D
@_Sys.initReturn0
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@_Sys.init
0;JMP
(_Sys.initReturn0)

//function Sys.init 0
(_Sys.init)

//push constant 6
@6
D=A
@SP
M=M+1
A=M-1
M=D

//push constant 8
@8
D=A
@SP
M=M+1
A=M-1
M=D

//call Class1.set 2
@_Class1.setReturn1
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@_Class1.set
0;JMP
(_Class1.setReturn1)

//pop temp 0
@SP
AM=M-1
D=M
@5
M=D

//push constant 23
@23
D=A
@SP
M=M+1
A=M-1
M=D

//push constant 15
@15
D=A
@SP
M=M+1
A=M-1
M=D

//call Class2.set 2
@_Class2.setReturn2
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@_Class2.set
0;JMP
(_Class2.setReturn2)

//pop temp 0
@SP
AM=M-1
D=M
@5
M=D

//call Class1.get 0
@_Class1.getReturn3
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@_Class1.get
0;JMP
(_Class1.getReturn3)

//call Class2.get 0
@_Class2.getReturn4
D=A
@SP
M=M+1
A=M-1
M=D
@LCL
D=M
@SP
M=M+1
A=M-1
M=D
@ARG
D=M
@SP
M=M+1
A=M-1
M=D
@THIS
D=M
@SP
M=M+1
A=M-1
M=D
@THAT
D=M
@SP
M=M+1
A=M-1
M=D
@5
D=A
@SP
D=M-D
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@_Class2.get
0;JMP
(_Class2.getReturn4)

//label WHILE
(_WHILE)

//goto WHILE
@_WHILE
0;JMP

//function Class1.set 0
(_Class1.set)

//push argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D

//pop static 0
@SP
AM=M-1
D=M
@_Class1.0
M=D

//push argument 1
@1
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D

//pop static 1
@SP
AM=M-1
D=M
@_Class1.1
M=D

//push constant 0
@0
D=A
@SP
M=M+1
A=M-1
M=D

//return
@LCL
D=M
@R14
M=D
@5
D=A
@R14
D=M-D
A=D
D=M
@R15
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@R14
MD=M-1
A=D
D=M
@THAT
M=D
@R14
MD=M-1
A=D
D=M
@THIS
M=D
@R14
MD=M-1
A=D
D=M
@ARG
M=D
@R14
MD=M-1
A=D
D=M
@LCL
M=D
@R15
A=M
0;JMP

//function Class1.get 0
(_Class1.get)

//push static 0
@_Class1.0
D=M
@SP
M=M+1
A=M-1
M=D

//push static 1
@_Class1.1
D=M
@SP
M=M+1
A=M-1
M=D

//sub
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D

//return
@LCL
D=M
@R14
M=D
@5
D=A
@R14
D=M-D
A=D
D=M
@R15
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@R14
MD=M-1
A=D
D=M
@THAT
M=D
@R14
MD=M-1
A=D
D=M
@THIS
M=D
@R14
MD=M-1
A=D
D=M
@ARG
M=D
@R14
MD=M-1
A=D
D=M
@LCL
M=D
@R15
A=M
0;JMP

//function Class2.set 0
(_Class2.set)

//push argument 0
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D

//pop static 0
@SP
AM=M-1
D=M
@_Class2.0
M=D

//push argument 1
@1
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D

//pop static 1
@SP
AM=M-1
D=M
@_Class2.1
M=D

//push constant 0
@0
D=A
@SP
M=M+1
A=M-1
M=D

//return
@LCL
D=M
@R14
M=D
@5
D=A
@R14
D=M-D
A=D
D=M
@R15
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@R14
MD=M-1
A=D
D=M
@THAT
M=D
@R14
MD=M-1
A=D
D=M
@THIS
M=D
@R14
MD=M-1
A=D
D=M
@ARG
M=D
@R14
MD=M-1
A=D
D=M
@LCL
M=D
@R15
A=M
0;JMP

//function Class2.get 0
(_Class2.get)

//push static 0
@_Class2.0
D=M
@SP
M=M+1
A=M-1
M=D

//push static 1
@_Class2.1
D=M
@SP
M=M+1
A=M-1
M=D

//sub
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D

//return
@LCL
D=M
@R14
M=D
@5
D=A
@R14
D=M-D
A=D
D=M
@R15
M=D
@SP
AM=M-1
D=M
@ARG
A=M
M=D
@ARG
D=M+1
@SP
M=D
@R14
MD=M-1
A=D
D=M
@THAT
M=D
@R14
MD=M-1
A=D
D=M
@THIS
M=D
@R14
MD=M-1
A=D
D=M
@ARG
M=D
@R14
MD=M-1
A=D
D=M
@LCL
M=D
@R15
A=M
0;JMP

//closing loop
(END)
@END
0;JMP
