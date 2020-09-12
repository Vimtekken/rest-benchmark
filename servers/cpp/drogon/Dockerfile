FROM drogonframework/drogon

RUN mkdir -p /app
WORKDIR /app

RUN drogon_ctl create project bench
WORKDIR /app/bench
ADD ./src/main.cc ./main.cc
ADD ./src/JsonCtrl.cc ./JsonCtrl.cc
ADD ./src/JsonCtrl.h ./JsonCtrl.h
ADD ./src/BenchmarkCtrl.cc ./BenchmarkCtrl.cc
ADD ./src/BenchmarkCtrl.h ./BenchmarkCtrl.h
ADD ./src/CMakeLists.txt ./CMakeLists.txt
# RUN ls
# RUN cat CMakeLists.txt
WORKDIR /app/bench/build
RUN cmake ..
RUN make

ENTRYPOINT [ "./bench" ]