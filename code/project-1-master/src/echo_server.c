/******************************************************************************
* echo_server.c                                                               *
*                                                                             *
* Description: This file contains the C source code for an echo server.  The  *
*              server runs on a hard-coded port and simply write back anything*
*              sent to it by connected clients.  It does not support          *
*              concurrent clients.                                            *
*                                                                             *
* Authors: Athula Balachandran <abalacha@cs.cmu.edu>,                         *
*          Wolf Richter <wolf@cs.cmu.edu>                                     *
*                                                                             *
*******************************************************************************/

#include <netinet/in.h>
#include <netinet/ip.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/sendfile.h>
#include <fcntl.h>
#include <sys/time.h>
#include <errno.h>
#include "parse.h"
#define ECHO_PORT 9999
#define BUF_SIZE 4096
#define HTTP_VERSION "HTTP/1.1"
int close_socket(int sock)
{
    if (close(sock))
    {
        fprintf(stderr, "Failed closing socket.\n");
        return 1;
    }
    return 0;
}
int get_extension(char *path,char *extension){

    size_t len = strlen(path);
    for (int i=len-1;i>= 0;--i)
    {
        if (path[i] == '.')
        {
            strncpy(extension,path+(i+1),len-1-i);
            return 1;
        }
    }

    return 0;
}//获得扩展名
void get_type(char *extension,char *type)
{

    if (!strcmp(extension,"html"))
    {
        strcpy(type,"text/html");
    }
    else if (!strcmp(extension,"css"))
    {
        strcpy(type,"text/css");
    }
    else if (!strcmp(extension,"png"))
    {
        strcpy(type,"image/png");
    }
    else if (!strcmp(extension,"jpeg"))
    {
        strcpy(type,"image/jpeg");
    }
    else if (!strcmp(extension,"gif"))
    {
        strcpy(type,"image/gif");
    }
    else
    {
        strcpy(type,"unknown/undifined");
    }//辨别类型

}
void access_log(){


}
void error_log(){


}
void send_respond(int client_sock,int state,Request *req){

    char *respond=(char*)malloc(sizeof(char)*BUF_SIZE);
    char fullpath[1024];
    char extension[10];
    char type[20];
    struct stat file_state;
    if(state==400){
        strcat(respond,HTTP_VERSION);
        strcat(respond," ");
        strcat(respond,"400 Bad Request");
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
        free(respond);
        return ;
    }
    else if(state==408){ 
        strcat(respond,HTTP_VERSION);
        strcat(respond," ");
        strcat(respond,"408 Request Timeout");
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
        free(respond);
        return ;
    } //请求超时
    strcat(fullpath,".");
    strcat(fullpath,req->http_uri);
    if(state==1){
        stat(fullpath, &file_state);
        strcat(respond,HTTP_VERSION);
        strcat(respond," ");
        strcat(respond,"200 OK");
        strcat(respond,"\r\n");

        strcat(respond,"Content-Type:");
        get_extension(fullpath,extension);
        get_type(extension,type);
        strcat(respond,type);

        strcat(respond,"\r\n");

        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);

        //send file
        int file=open(fullpath,O_RDONLY);
        stat(fullpath,&file_state);
        int len=file_state.st_size;
        sendfile(client_sock,file,NULL,len);
    }//get
    else if(state==2){
        stat(fullpath, &file_state);
        strcat(respond,HTTP_VERSION);
        strcat(respond," ");
        strcat(respond,"200 OK");
        strcat(respond,"\r\n");

        strcat(respond,"Content-Type:");
        get_extension(fullpath,extension);
        get_type(extension,type);
        strcat(respond,type);
        strcat(respond,"\r\n");

        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
    }//head
    else if(state==3){
        strcat(respond,"-----echo-----\r\n");
        strcat(respond,req->http_method);
        strcat(respond," ");
        strcat(respond,req->http_uri);
        strcat(respond," ");
        strcat(respond,HTTP_VERSION);
        strcat(respond,"\r\n");
        for(int i=0;i<req->header_count;++i){
            strcat(respond,req->headers[i].header_name);
            strcat(respond," ");
            strcat(respond,req->headers[i].header_value);
            strcat(respond,"\r\n");
        }
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
    }//post
    else if(state==404){
        strcat(respond,req->http_version);
        strcat(respond," ");
        strcat(respond,"404 Not Found");
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
    }
    else if(state==505){
        strcat(respond,HTTP_VERSION);
        strcat(respond," ");
        strcat(respond,"505 HTTP Version Not Supported");
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
    }
    else if(state==501){
        strcat(respond,req->http_version);
        strcat(respond," ");
        strcat(respond,"501 Not Implemented");
        strcat(respond,"\r\n");
        send(client_sock,respond,strlen(respond),0);
    }
    free(respond);
}
void analyze_req(int sock,int client_sock,char *buffer,int buff_size){

    Request *req = parse(buffer,buff_size,sock);

    if(req==NULL){
        printf("req is null\n");
        send_respond(client_sock,400,req);

    }
    else if(strcmp(req->http_version,HTTP_VERSION)){
        send_respond(client_sock,505,req);
    }
    else if(!strcmp(req->http_method,"GET")){
        char path[1000];
        strcat(path,".");
        strcat(path,req->http_uri);
        if(access(path,F_OK)){
            send_respond(client_sock,404,req);
        }
        else if(access(path,R_OK)){
            send_respond(client_sock,404,req);
        }
        else send_respond(client_sock,1,req);
    }
    else if(!strcmp(req->http_method,"HEAD")){
        send_respond(client_sock,2,req);
    }
    else if(!strcmp(req->http_method,"POST")){
        send_respond(client_sock,3,req);
    }
    else{
        send_respond(client_sock,501,req);
    }

    //free
    if(req==NULL){
        free(req);
        return ;
    }
    else {
        free(req->headers);
        free(req);
        return ;
    }

}
int main(int argc, char* argv[])
{


    int sock, client_sock;
    ssize_t readret;
    socklen_t cli_size;
    struct sockaddr_in addr, cli_addr;
    char buf[BUF_SIZE];
    int time=0;
	struct timeval last;
	struct timeval now;
    fprintf(stdout, "----- Echo Server -----\n");
    if ((sock = socket(PF_INET, SOCK_STREAM, 0)) == -1)
    {
        fprintf(stderr, "Failed creating socket.\n");
        return EXIT_FAILURE;
    }
    int flags = fcntl(sock, F_GETFL, 0);
    fcntl(sock, F_SETFL, flags | O_NONBLOCK);


	gettimeofday(&last,NULL);
    //printf("start %d %d\n", )
    addr.sin_family = AF_INET;
    addr.sin_port = htons(ECHO_PORT);
    addr.sin_addr.s_addr = INADDR_ANY;
    if (bind(sock, (struct sockaddr *) &addr, sizeof(addr)))
    {
        close_socket(sock);
        fprintf(stderr, "Failed binding socket.\n");
        return EXIT_FAILURE;
    }

    if (listen(sock, 5))
    {
        close_socket(sock);
        fprintf(stderr, "Error listening on socket.\n");
        return EXIT_FAILURE;
    }

    while (1)
    {
        cli_size = sizeof(cli_addr);
        if ((client_sock = accept(sock, (struct sockaddr *) &cli_addr,&cli_size)) == -1&&(errno==EAGAIN||errno==EWOULDBLOCK)){

            gettimeofday(&last,NULL);
            time=(now.tv_sec-last.tv_sec)*1000000+(now.tv_usec-last.tv_usec);//微秒
    		if(time>=100000000000)     //set time-out 1s
    		{
    			send_respond(client_sock,408,NULL);//
    			break;
    		}
        }
        else {
        readret = 0;
        while((readret = recv(client_sock, buf, BUF_SIZE, 0)) >= 1)
        {
            gettimeofday(&last,NULL);
            analyze_req(sock,client_sock,buf,readret);
            if (0)//send(client_sock, buf, readret, 0) != readret
            {
                close_socket(client_sock);
                close_socket(sock);
                fprintf(stderr, "Error sending to client.\n");
                return EXIT_FAILURE;
            }

            memset(buf, 0, BUF_SIZE);
        }

        if (readret == -1)
        {
            close_socket(client_sock);
            close_socket(sock);
            fprintf(stderr, "Error reading from client socket.\n");
            return EXIT_FAILURE;
        }

        if (close_socket(client_sock))
        {
            close_socket(sock);
            fprintf(stderr, "Error closing client socket.\n");
            return EXIT_FAILURE;
        }
        }
    }

    close_socket(sock);

    return EXIT_SUCCESS;
}