FROM docker.io/fedora:32

COPY install-dependencies.sh .

RUN ./install-dependencies.sh && dnf install -y \
    git \
    clang 

RUN mkdir /seastar
WORKDIR /seastar
RUN git clone https://github.com/scylladb/seastar.git
WORKDIR /seastar/seastar
RUN git checkout tags/seastar-20.05.0
RUN ./configure.py --mode=release --c++-dialect=gnu++17
RUN ninja -C build/release
RUN ninja -C build/release install

# Our httpd server
RUN mkdir -p /app
WORKDIR /app
ADD ./src ./

ENV PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/seastar/seastar/build/release
RUN ls /seastar/seastar/build/release
RUN g++ ./httpd/main.cc $(pkg-config --libs --cflags --static seastar) -o bench
 
ENTRYPOINT [ "./bench" ]
