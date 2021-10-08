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
char *WWW;
char* http_version = "HTTP/1.1";
const char* default_index_file = "index.html";
int close_socket(int sock)
{
    if (close(sock))
    {
        fprintf(stderr, "Failed closing socket.\n");
        return 1;
    }
    return 0;
}
int is_dir(char*path){
  size_t len=strlen(path);
  if (path[len - 1] == '/')
  {
      return 1;
  }
  return 0;
}//查看是否为目录
size_t get_file_len(const char* fullpath) {
  struct stat st;
  stat(fullpath, &st);
  return st.st_size;
}//返回文件长度
void get_curr_time(char *time_buf, size_t buf_size) {
  time_t raw_time;
  struct tm * timeinfo;

  time(&raw_time);
  timeinfo = localtime(&raw_time);
  strftime(time_buf, buf_size, "%a, %d %b %Y %H:%M:%S %Z", timeinfo);
}//显示时间
void get_extension( char *path, char *result)
{
    size_t len = strlen(path);
    for (int i = len - 1; i >= 0; i--)
    {
        int curr_len = len - i;
        if (path[i] == '.')
        {
            strncpy(result, path + (len - curr_len) + 1, curr_len - 1);
            return;
        }
    }
    strncpy(result, "none", 4);
}

void get_type( char *mime, char *type)
{
    if (!strcmp(mime, "html"))
    {
        strcpy(type, "text/html");
    }
    else if (!strcmp(mime, "css"))
    {
        strcpy(type, "text/css");
    }
    else if (!strcmp(mime, "png"))
    {
        strcpy(type, "image/png");
    }
    else if (!strcmp(mime, "wbeg"))
    {
        strcpy(type, "image/webp");
    }
    else if (!strcmp(mime, "gif"))
    {
        strcpy(type, "image/gif");
    }
    else if(!strcmp(mime,"xml"))
    {
        strcpy(type,"application/xml");
    }
    else{
      strcpy(type,"application/xhtml+xml");
    }
}
void get_flmodified(const char*path, char *last_mod_time, size_t buf_size) {
  struct stat st;
  struct tm *curr_gmt_time = NULL;
  stat(path, &st);
  curr_gmt_time = gmtime(&st.st_mtime);
  strftime(last_mod_time, buf_size, "%a, %d %b %Y %H:%M:%S %Z", curr_gmt_time);
}
void get_header_value(Request *request, const char *hname, char *hvalue)
{
    for (int i = 0; i < request->header_count; i++)
    {
        if (!strcmp(request->headers[i].header_name, hname))
        {
            strcpy(hvalue, request->headers[i].header_value);
            return;
        }
    }
}
int send_file_to_client(int client_socket, char* full_path)
{
    int fd = open(full_path, O_RDONLY);
    if (fd < 0)
    {
        dump_log("[IO][ERROR] Error when opening file %s for reading", full_path);
        return -1;
    }

    size_t file_length = get_file_len(full_path);

    ssize_t ret = sendfile(client_socket, fd, NULL, file_length);
    if (ret == -1)
    {
        err_sys("[io] sendfile error");
    }

    return 0;
}
void response404(int clientfd, char *response)
{
    strcat(response, http_version);
    strcat(response, " 404 Not Found\r\n\r\n");
    printf("[response] response = \n%s\n", response);
    send(clientfd, response, strlen(response),0);
}
void response400(int client_socket){
  char response[1024];
  strcat(response,"HTTP/1.1 400 Bad Request");
  strcat(response,"\n");
  send(client_socket,response,strlen(response),0);
}
void response505(int clinet_socket){
  char response[1024];
  strcat(response, http_version);
  strcat(response, " 505 HTTP Version not supported\r\n");
  strcat(response, "Connection: close\r\n");
  send(clinet_socket,response,strlen(response),0);
}
void response501(int clinet_socket){
  char response[1024];
  strcat(response,http_version);
  strcat(response," 501 Method Unimplemented\r\n\r\n");
  send(clinet_socket,response,strlen(response),0);
}
void res(int client_socket,int status,Request*req){
    if(status==501){
        response501(client_socket);
        }//echo the request
    else if(status==400){
        response400(client_socket);
    }
    else if(status==1){
      char *str=(char*)malloc(sizeof(char)*BUF_SIZE);
      char response[BUF_SIZE];
      char fullpath[1024];
      char extension[16];
      char mime_type[64];
      char curr_time[256];
      char last_modified[256];
      size_t content_length;
      char content_len_str[16];
      char connection_header_val[32];
      strcpy(fullpath,WWW);
      strcat(fullpath,req->http_uri);
      if (is_dir(fullpath))
          strcat(fullpath, default_index_file);//检查是否是目录
      if access(fullpath,F_OK){
        dump_log("[response] request file not found\n");
        response404(client_socket, str);
        return 0;
      }//若无法访问就返回错误信息404
      get_extension(fullpath,extension);
      get_type(extension,mime_type);
      content_length=get_file_len(fullpath);
      sprintf(content_len_str,"%zu",content_length);
      get_curr_time(curr_time,BUF_SIZE);
      get_flmodified(fullpath,last_modified,256);
      strcat(response, http_version);
      strcat(response, " 200 OK\r\n");

      strcat(response, "Server: ");
      strcat(response, server_name);
      strcat(response, "\r\n");

      strcat(response, "Date: ");
      strcat(response, curr_time);
      strcat(response, "\r\n");
      strcat(response, "Content-Length: ");
      strcat(response, content_len_str);
      strcat(response, "\r\n");

      strcat(response, "Content-type: ");
      strcat(response, mime_type);
      strcat(response, "\r\n");

      strcat(response, "Last-modified: ");
      strcat(response, last_modified);
      strcat(response, "\r\n");
      memset(connection_header_val, 0, sizeof(connection_header_val));
      get_header_value(request, "Connection", connection_header_val);
      if (!strcmp(connection_header_val, "close"))
      {
          strcat(response, "Connection: close\r\n");
      }
      else
      {
          strcat(response, "Connection: keep-alive\r\n");
      }

      strcat(response, "\r\n");

      // printf("[response] response = \n%s\n", response);
      // printf("[response] fullpath = %s\n", fullpath);

      send(client_socket, response, strlen(response));

      send_file_to_client(client_socket, fullpath);

      return 0;
      free(str);
    }
    /*else if(status=2){

    }
    else if(status=3){

    }*/
    //send(client_socket,str,strlen(str),0);

}//check the status and response
void check(int client_sock,char *buffer,int buff_size){
        Request *req=parse(buffer,buff_size,client_sock);
        if(req==NULL){
            res(client_sock,400,req);
        }
        if(!strcmp(req->http_method,"GET")){
            res(client_sock,1,req);
        }
        else if(!strcmp(req->http_method,"POST")){
            res(client_sock,3,req);
        }
        else if(!strcmp(req->http_method,"HEAD")){
            res(client_sock,2,req);
        }
        else
        {res(client_sock,501,req);
        }

}//check the method the request used
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
    //int response_get(int clientf)


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
            check(client_sock,buf,readret);
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
