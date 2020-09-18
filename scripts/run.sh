docker run --env-file local.env --tty -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}/:/out rest-benchmark:latest

# Example of running one (or more) specific app configs
# docker run --env-file local.env --tty -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}/:/out rest-benchmark:latest run start dart-raw-native
