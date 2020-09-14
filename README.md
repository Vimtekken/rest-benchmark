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

## Known Bugs
First launch of the test suite will result in a failure to connect
to the results database. Stopping the execution and restarting will
fix the issue. Seems that the first run dodesn't launch the results
database properly. I am not sure why this only happens on the first
run after a clean.
