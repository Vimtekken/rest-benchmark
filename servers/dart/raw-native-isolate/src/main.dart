// import 'dart:html';
import 'dart:io';
import 'dart:async';
import 'dart:isolate';

// Begin Isolate
void isolateHandler(SendPort outPort) {
  ReceivePort inPort = ReceivePort();
  inPort.listen((message) {
    // stdout.write('Handler: ' + message + '\n');
    message.send(""); // Response for healthcheck
  });
  outPort.send(inPort.sendPort);
}

ReceivePort receivePort = ReceivePort();
// SendPort handlerPort;
int threads = 2; // @todo Add OS read of threads
var handlerPorts = new List(threads);
void start() async {
  for(var i = 0 ; i < threads; i++) {
    ReceivePort receivePort = ReceivePort();
    await Isolate.spawn(isolateHandler, receivePort.sendPort);
    receivePort.listen((message) {
      handlerPorts[i] = message;
    });
  }
}
// End Isolate

int portPosition = 0;
SendPort pickPort() {
  var port = handlerPorts[portPosition];
  portPosition++;
  if (portPosition >= threads) {
    portPosition = 0;
  }
  return port;
}

// Begin Server
Future healthcheck(HttpRequest request) async {
  // request.response.close();
  var port = pickPort();
  ReceivePort receivePort = ReceivePort();
  port.send(receivePort.sendPort);
  receivePort.listen((message) async {
    // print('Writing response');
    await request.response.write(message);
    // print('Flushing');
    // await request.response.flush();
    // print('Closing');
    await request.response.close();
  });
}

Future handleRequest(HttpRequest request) async {
  try {
    if (request.uri.pathSegments.length > 0) {
      if (request.uri.pathSegments[0] == 'healthcheck') {
        await healthcheck(request);
      }
    } else {
      await healthcheck(request);
    }
  } catch (e) {
    print('Exception in handleRequest: $e');
  }
}

Future launch() async {
  print('Starting Isolate');
  await start();

  print('Launching Server');
  final server = await HttpServer.bind(
    InternetAddress.anyIPv4,
    8080,
  );

  await for (HttpRequest request in server) {
    await handleRequest(request);
  }
}
// End Server

// Main
void main() {
  launch();
}
