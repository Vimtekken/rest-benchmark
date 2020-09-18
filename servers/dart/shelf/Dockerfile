FROM google/dart

WORKDIR /app

ADD ./pubspec.yml ./pubspec.yaml
RUN pub get
ADD ./src /app
RUN dart2native main.dart
RUN ls

CMD []
ENTRYPOINT ["./main.exe"]