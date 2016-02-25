all: client server

server:
	node index.js

client:
	./node_modules/.bin/webpack

client.build:
	./node_modules/.bin/webpack --watch
