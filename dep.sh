#!/bin/sh

cd /home/HouXinLin/project/vue/Desktop/Desktop/
npm run build
rm -rf /home/HouXinLin/project/java/cool/CoolDesktop/desktop-web/src/main/resources/static/*
cp -r ./dist/* /home/HouXinLin/project/java/cool/CoolDesktop/desktop-web/src/main/resources/static/
rm -rf /home/HouXinLin/project/java/cool/CoolDesktop/desktop-web/build/libs/*



