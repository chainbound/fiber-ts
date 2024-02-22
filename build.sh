#!/bin/bash

PROTO_DIR=./fiber-proto
TARGET=./protobuf

rm -rf $TARGET

mkdir $TARGET

# At the time of writing, grpc-tools only supports CommonJS.
# As such, when you generate this files, you will need to manually
# change the file extensions from .js to .cjs and from .d.ts to .d.cts,
# and make sure you import them accordingly in this ES project.
yarn run grpc_tools_node_protoc \
	--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
	--ts_out=grpc_js:$TARGET \
	--js_out=import_style=commonjs:$TARGET \
	--grpc_out=grpc_js:$TARGET \
	-I $PROTO_DIR $PROTO_DIR/{api,eth,types}.proto

