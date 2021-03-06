set(LIBRARIES
  AppManPMInterface
  ApplicationManager
  HMI_API
  MOBILE_API
  SmartObjects
  formatters
  ProtocolHandler
  connectionHandler
  TransportManager
  HMIMessageHandler
  MessageBroker
  MessageBrokerClient
  MessageBrokerServer
  ProfileManager
  ProfileManagerIPC
  AppManHmiProtocol
  ZmqSocket
  Utils
  encryption
  jsoncpp
  bluetooth
  pthread
  rt
  avahi-client
  avahi-common
  ConfigProfile
  MobileMessageHandler
  RequestWatchdog
  AudioManager
  log4cplus
  pulse
  uuid
  gobject-2.0
  glib-2.0
)

# required to find 'glibconfig.h'
find_package(PkgConfig)
pkg_check_modules(GLIB2 REQUIRED glib-2.0)
add_definitions(${GLIB2_CFLAGS})

include_directories (
  ./
  ../components/protocol_handler/include/
  ../components/application_manager_profile_manager_interface/include/
  ../thirdPartyLibs/jsoncpp/include/
  ../components/mobile_message_handler/include
  ../components/application_manager/include
  ../components/formatters/include
  ../components/transport_manager/include
  ../components/config_profile/include
  ../components/utils/include/
  ../components/connection_handler/include/
  ../components/hmi_message_handler/include
  ../components/request_watchdog/include
  ../components/smart_objects/include/
  ../components/audio_manager/include/
  ../components/profile_manager/include/
  ../utils/include/
  ../components/utils/include/utils/
  ../thirdPartyLibs/MessageBroker/include
  ../thirdPartyLibs/encryption/include
  ${CMAKE_BINARY_DIR}/src/components/
  /usr/lib/i386-linux-gnu/glib-2.0/include
  /usr/lib/x86_64-linux-gnu/glib-2.0/include/
  ${GSTREAMER_gst_INCLUDE_DIR}
  ${GLIB_glib_2_INCLUDE_DIR}
)

set (SOURCES
  appMain.cpp
  life_cycle.cc
)

if( NOT CMAKE_BUILD_TYPE )
  set(CMAKE_BUILD_TYPE Debug CACHE STRING "Choose the type of build. Options are: None, Debug, Release, RelWithDebInfo, MinSizeRel." FORCE)
endif()

add_executable(${PROJECT} ${SOURCES})
target_link_libraries(${PROJECT} ${LIBRARIES})

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/log4cxx.properties DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/log4cplus.properties DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/audio.8bit.wav DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/test.txt DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/smartDeviceLink.ini DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/policy_table.json DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

file(WRITE ${CMAKE_CURRENT_BINARY_DIR}/hmi_link "${CMAKE_HOME_DIRECTORY}/src/components/HMI/index.html")

install (TARGETS ${PROJECT} DESTINATION bin)

