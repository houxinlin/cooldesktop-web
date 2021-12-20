#!/bin/sh

cd /home/HouXinLin/project/vue/Desktop/Desktop/
npm run build
rm -rf /home/HouXinLin/project/java/CoolDesktop/Desktop-Web/src/main/resources/static/*
cp -r ./dist/* /home/HouXinLin/project/java/CoolDesktop/Desktop-Web/src/main/resources/static/

