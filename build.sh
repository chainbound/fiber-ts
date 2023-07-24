#!/bin/bash

PROTO_DIR=./fiber-proto
TARGET=./protobuf

rm -rf $TARGET

mkdir $TARGET

# yarn run grpc_tools_node_protoc \
#     --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
#     --js_out=import_style=commonjs:$TARGET \
#     --grpc_out=$TARGET \
#     -I $PROTO_DIR $PROTO_DIR/api.proto

yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=grpc_js:$TARGET \
    --js_out=import_style=commonjs:$TARGET \
    --grpc_out=grpc_js:$TARGET \
    -I $PROTO_DIR $PROTO_DIR/{api,eth,types}.proto