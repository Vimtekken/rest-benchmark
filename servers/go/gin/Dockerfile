FROM golang:latest

RUN go get -u github.com/gin-gonic/gin
WORKDIR /app
ADD ./src /app
ENTRYPOINT [ "go", "run", "main.go" ]
