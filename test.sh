#!/bin/bash

node test/server/index.js & karma start karma.conf.js
kill $!