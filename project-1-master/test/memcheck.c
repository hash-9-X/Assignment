#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void f1(void){
    int* x = malloc(10 * sizeof(int));
    x[10] = 0;      // 问题 1: 堆块溢出
    // free(x);     // 问题 2: 内存泄漏（definitely）
} 

void f2(void){
    static char *a; // 全局静态变量
    char *b;  
  
    b = (char*)malloc(10);  
    a = b+1;        // 问题 3：内存泄漏（possibly）
    // a -= 1;      // 问题 4: 内存泄漏（still reachable）
}

int main(void){
    f1();
    // f2();
    return 0;
 }