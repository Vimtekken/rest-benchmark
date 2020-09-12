FROM google/dart

WORKDIR /app

ADD ./src /app
RUN dart2native main.dart
RUN ls

CMD []
ENTRYPOINT ["./main.exe"]