FROM aredwood/deno

RUN mkdir -p /app
WORKDIR /app
ADD ./src /app
ENTRYPOINT [ "deno" ]
CMD [ "run", "--allow-net", "./main.ts" ]
