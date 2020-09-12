FROM silkeh/clang:latest

# Install pistache
RUN mkdir -p /app
WORKDIR /app
RUN git clone https://github.com/oktal/pistache.git
WORKDIR /app/pistache
RUN mkdir build
WORKDIR /app/pistache/build
RUN cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release ..
RUN make
RUN make install

# Add openssl
RUN apt-get install openssl

# Compile main
WORKDIR /app
ADD ./src ./
RUN mkdir build
WORKDIR /app/build
RUN cmake -G "Unix Makefiles" ..
RUN make
RUN ls
ENTRYPOINT [ "/app/build/pistache-bench" ]
