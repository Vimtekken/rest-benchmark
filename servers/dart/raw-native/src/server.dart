import 'dart:io';

Future healthcheck(HttpRequest request) async {
  request.response.close();
}

Future handleRequest(HttpRequest request) async {
  try {
    if (request.uri.pathSegments.length > 0) {
      if (request.uri.pathSegments[0] == 'healthcheck') {
        await healthcheck(request);
      }
    }
    await healthcheck(request);
  } catch (e) {
    print('Exception in handleRequest: $e');
  }
}

Future launch() async {
  final server = await HttpServer.bind(
    InternetAddress.anyIPv4,
    8080,
  );

  await for (HttpRequest request in server) {
    await handleRequest(request);
  }
}
