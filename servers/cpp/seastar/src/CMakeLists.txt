cmake_minimum_required(VERSION 3.17)

add_custom_target (apps)

macro (seastar_add_app name)
  set (args ${ARGN})

  cmake_parse_arguments (
    parsed_args
    ""
    ""
    "SOURCES"
    ${args})

  set (target app_${name})
  add_executable (${target} ${parsed_args_SOURCES})

  target_include_directories (${target}
    PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

  target_link_libraries (${target}
    PRIVATE seastar_private)

  set_target_properties (${target}
    PROPERTIES
      OUTPUT_NAME ${name})

  add_dependencies (apps ${target})
endmacro ()

add_subdirectory (httpd)