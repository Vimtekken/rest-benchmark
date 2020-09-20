#include "lithium_http_backend.hh"

using namespace li;

int main() {
  // Build an api.
  http_api api;

  // Define a HTTP GET endpoint.
  api.get("/healthcheck") = [&](http_request& request, http_response& response) {
    response.write("");
  };

  // Start a http server.
  http_serve(api, 8080);
}
