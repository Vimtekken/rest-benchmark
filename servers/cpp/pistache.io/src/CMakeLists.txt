cmake_minimum_required(VERSION 3.13.4)

find_library(
  PISTACHE_LIB
  NAMES pistache libpistache
  HINTS "/usr/local/lib"
)

add_executable(pistache-bench main.cpp)

SET(CMAKE_CXX_FLAGS  "${CMAKE_CXX_FLAGS} ${GCC_COVERAGE_COMPILE_FLAGS} -O3 -lpthread -std=c++17")
target_link_libraries(
	pistache-bench
  PRIVATE "${PISTACHE_LIB}"
)
