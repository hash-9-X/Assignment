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
#include <unistd.h>
#include "parse.h"
#define ECHO_PORT 9999
#define BUF_SIZE 4096

int close_socket(int sock)
{
    if (close(sock))
    {
        fprintf(stderr, "Failed closing socket.\n");
        return 1;
    }
    return 0;
}

void send_str(int client_sock,int state,Request *req){

    char *str=(char*)malloc(sizeof(char)*BUF_SIZE);
    if(state==501){
      strcat(str,req->http_version);
      strcat(str," ");
      strcat(str,"501 Not Implemented");
      strcat(str," ");
      strcat(str,"\n");
      strcat(str,"\n");
    }
    else if(state==1){
        strcat(str,req->http_version);
        strcat(str," ");
        strcat(str,req->“OK”)；
        strcat(str,"\n");
        strcat(str,req->http_method);
        strcat(str," ");
        strcat(str,req->http_uri);
        strcat(str," ");
        strcat(str,req->http_version);
        strcat(str,"\n");
        //strcat(str,"\n");
        for(int i=0;i<req->header_count;++i){
            strcat(str,req->headers[i].header_name);
            strcat(str," ");
            strcat(str,req->headers[i].header_value);
            strcat(str,"\n");
        }
        strcat(str,"\n");
    }
    else if(state==400){
      strcat(str,"HTTP/1.1");
      strcat(str," ");
      strcat(str,"400 Bad Request");
      strcat(str," ");
      strcat(str,"\n");
      strcat(str,"\n");
    }
    send(client_sock,str,strlen(str),0);
    free(str);

}
void analyze_req(int sock,int client_sock,char *buffer,int buff_size){

    Request *req = parse(buffer,buff_size,sock);
    if(req==NULL){
        printf("req is null\n");
        send_str(client_sock,400,req);
    }
    else if(!strcmp(req->http_method,"GET")){
        send_str(client_sock,1,req);
        printf("req is get\n");
    }
    else if(!strcmp(req->http_method,"POST")){
      printf("req is get\n");
      send_str(client_sock,1,req);
    }
    else if(!strcmp(req->http_method,"HEAD")){
      printf("req is get\n");
      send_str(client_sock,1,req);
    }
    else{
        send_str(client_sock,501,req);
    }
    return ;

}

int main(int argc, char* argv[])
{
    int sock, client_sock;
    ssize_t readret;
    socklen_t cli_size;
    struct sockaddr_in addr, cli_addr;
    char buf[BUF_SIZE];

    fprintf(stdout, "----- Echo Server -----\n");

    /* all networked programs must create a socket */
    if ((sock = socket(PF_INET, SOCK_STREAM, 0)) == -1)
    {
        fprintf(stderr, "Failed creating socket.\n");
        return EXIT_FAILURE;
    }

    addr.sin_family = AF_INET;
    addr.sin_port = htons(ECHO_PORT);
    addr.sin_addr.s_addr = INADDR_ANY;

    /* servers bind sockets to ports---notify the OS they accept connections */
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

    /* finally, loop waiting for input and then write it back */
    while (1)
    {
        cli_size = sizeof(cli_addr);
        if ((client_sock = accept(sock, (struct sockaddr *) &cli_addr,
                                    &cli_size)) == -1)
        {
            close(sock);
            fprintf(stderr, "Error accepting connection.\n");
            return EXIT_FAILURE;
        }

        readret = 0;

        while((readret = recv(client_sock, buf, BUF_SIZE, 0)) >= 1)
        {
            analyze_req(sock,client_sock,buf,readret);

            /*if (send(client_sock, buf, readret, 0) != readret)
            {
                close_socket(client_sock);
                close_socket(sock);
                fprintf(stderr, "Error sending to client.\n");
                return EXIT_FAILURE;
            }*/

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

    close_socket(sock);

    return EXIT_SUCCESS;
}
