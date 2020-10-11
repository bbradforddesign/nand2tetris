@17
D=A
@SP
M=M+1
A=M-1
M=D // push constant 17
@17
D=A
@SP
M=M+1
A=M-1
M=D // push constant 17
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=D-M
@EQ_0
D;JEQ
D=1
(EQ_0)
@SP
A=M
M=D-1
@SP
M=M+1 // eq
@17
D=A
@SP
M=M+1
A=M-1
M=D // push constant 17
@16
D=A
@SP
M=M+1
A=M-1
M=D // push constant 16
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=D-M
@EQ_1
D;JEQ
D=1
(EQ_1)
@SP
A=M
M=D-1
@SP
M=M+1 // eq
@16
D=A
@SP
M=M+1
A=M-1
M=D // push constant 16
@17
D=A
@SP
M=M+1
A=M-1
M=D // push constant 17
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=D-M
@EQ_2
D;JEQ
D=1
(EQ_2)
@SP
A=M
M=D-1
@SP
M=M+1 // eq
@892
D=A
@SP
M=M+1
A=M-1
M=D // push constant 892
@891
D=A
@SP
M=M+1
A=M-1
M=D // push constant 891
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_3
D;JLT
@GT_3
0;JMP
(LT_3)
D=-1
@STORE_3
0;JMP
(GT_3)
D=0
(STORE_3)
@SP
A=M
M=D
@SP
M=M+1 // lt
@891
D=A
@SP
M=M+1
A=M-1
M=D // push constant 891
@892
D=A
@SP
M=M+1
A=M-1
M=D // push constant 892
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_4
D;JLT
@GT_4
0;JMP
(LT_4)
D=-1
@STORE_4
0;JMP
(GT_4)
D=0
(STORE_4)
@SP
A=M
M=D
@SP
M=M+1 // lt
@891
D=A
@SP
M=M+1
A=M-1
M=D // push constant 891
@891
D=A
@SP
M=M+1
A=M-1
M=D // push constant 891
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_5
D;JLT
@GT_5
0;JMP
(LT_5)
D=-1
@STORE_5
0;JMP
(GT_5)
D=0
(STORE_5)
@SP
A=M
M=D
@SP
M=M+1 // lt
@32767
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32767
@32766
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32766
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_6
D;JLT
@GT_6
0;JMP
(LT_6)
D=0
@STORE_6
0;JMP
(GT_6)
D=-1
(STORE_6)
@SP
A=M
M=D
@SP
M=M+1 // gt
@32766
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32766
@32767
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32767
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_7
D;JLT
@GT_7
0;JMP
(LT_7)
D=0
@STORE_7
0;JMP
(GT_7)
D=-1
(STORE_7)
@SP
A=M
M=D
@SP
M=M+1 // gt
@32766
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32766
@32766
D=A
@SP
M=M+1
A=M-1
M=D // push constant 32766
@SP
M=M-1
A=M
D=M
@SP
AM=M-1
D=M-D
@LT_8
D;JLT
@GT_8
0;JMP
(LT_8)
D=0
@STORE_8
0;JMP
(GT_8)
D=-1
(STORE_8)
@SP
A=M
M=D
@SP
M=M+1 // gt
@57
D=A
@SP
M=M+1
A=M-1
M=D // push constant 57
@31
D=A
@SP
M=M+1
A=M-1
M=D // push constant 31
@53
D=A
@SP
M=M+1
A=M-1
M=D // push constant 53
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=M+D // add
@112
D=A
@SP
M=M+1
A=M-1
M=D // push constant 112
@82
D=A
@SP
M=M+1
A=M-1
M=D // push constant 82
