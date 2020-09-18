FROM rust:latest

RUN rustup toolchain install nightly

WORKDIR /
RUN git clone https://github.com/SergioBenitez/Rocket
WORKDIR /Rocket
RUN git checkout v0.4.5
WORKDIR /Rocket/examples/hello_world
RUN cargo +nightly build
ADD ./Rocket.toml ./
RUN ls ./src
ADD ./src/main.rs ./src/main.rs
RUN cat ./src/main.rs
ENTRYPOINT [ "cargo", "+nightly" ]
CMD [ "run" ]
