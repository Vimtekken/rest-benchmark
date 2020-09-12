# rest-benchmark
Benchmarking a variety of REST server frameworks.

## Seastar
For seastar to function properly, at least on linux.
You will need to make sure your async io provisions
are high enough on the host machine. Here are some
commands to increase it if needed.

sudo echo "fs.aio-max-nr = 1048576" >> '/etc/sysctl.conf'
sudo sysctl -p /etc/sysctl.conf

## Pistache.io
For some readon pistache.io doesn't connect/respond well to
apache bench. Do not know why.
