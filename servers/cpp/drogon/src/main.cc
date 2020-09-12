#include <cstdio>
#include <drogon/drogon.h>

using namespace drogon;

int main()
{
    puts("Launching drogon");
    app()
        .setLogPath("./")
        .setLogLevel(trantor::Logger::kWarn)
        .addListener("0.0.0.0", 8080)
        .setThreadNum(0)
        .registerSyncAdvice([](const HttpRequestPtr &req) -> HttpResponsePtr {
            const auto &path = req->path();
            auto response = HttpResponse::newHttpResponse();
            response->setBody("");
            return response;
        })
        .run();
}
