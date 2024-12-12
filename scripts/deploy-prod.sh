#!/bin/bash

dc -f docker-compose.prod.yml build
dc -f docker-compose.prod.yml up -d

