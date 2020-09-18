FROM ubuntu:20.04

RUN apt-get update
RUN apt-get install -y wget
RUN apt-get install -y git
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN apt-get install -y libssl-dev
RUN apt-get install -y build-essential
RUN apt-get install -y libboost-all-dev
RUN apt-get install -y g++-10
RUN apt-get install -y openssl

RUN mkdir -p /app
WORKDIR /app
RUN wget https://raw.githubusercontent.com/matt-42/lithium/master/single_headers/lithium_http_backend.hh
ADD ./src ./

RUN g++-10 -std=c++2a ./main.cc -lpthread -lboost_context -lcrypto -lssl -o a.out
ENTRYPOINT [ "./a.out" ]
