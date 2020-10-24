@0
D=A
@SP
M=M+1
A=M-1
M=D // push constant 0    
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
(_LOOP_START) // label LOOP_START
@0
D=A
@ARG
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push argument 0    
@0
D=A
@LCL
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push local 0
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D // add
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
@_LOOP_START
D;JGT // if-goto LOOP_START  
@0
D=A
@LCL
A=D+M
D=M
@SP
M=M+1
A=M-1
M=D // push local 0
(END)
@END
0;JMP
