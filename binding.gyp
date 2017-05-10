{
  "targets": [
    {
      "target_name": "main",
      "sources": [ "trajectory/main.cc" ],
      "libraries": [ "/usr/lib/libc++.dylib"],
      "cflags_cc!": [ "-fno-rtti", "-fno-exceptions" ],
      "cflags!": [ "-fno-exceptions" ],
      "conditions": [
                      [ 'OS=="mac"', {
                          "xcode_settings": {
                              'OTHER_CPLUSPLUSFLAGS' : ['-std=c++11','-stdlib=libc++', '-v'],
                              'OTHER_LDFLAGS': ['-stdlib=libc++'],
                              'MACOSX_DEPLOYMENT_TARGET': '10.7',
                              'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                          }
                      }]
                  ]
    }
  ]
}