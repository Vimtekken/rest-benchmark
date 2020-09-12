seastar_generate_swagger (
  TARGET app_httpd_swagger
  VAR app_httpd_swagger_files
  IN_FILE ${CMAKE_CURRENT_SOURCE_DIR}/demo.json
  OUT_DIR ${CMAKE_CURRENT_BINARY_DIR})

seastar_add_app (httpd
  SOURCES
    ${app_httpd_swagger_files}
    main.cc)

target_include_directories (app_httpd
  PRIVATE ${CMAKE_CURRENT_BINARY_DIR})

add_dependencies (app_httpd app_httpd_swagger)
