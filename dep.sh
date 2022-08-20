#!/bin/sh

cd /home/HouXinLin/projects/java/cool/desktop-web/
npm run build
rm -rf /home/HouXinLin/projects/java/cool/CoolDesktop/desktop-web/src/main/resources/static/static/*
cp -r ./dist/* /home/HouXinLin/projects/java/cool/CoolDesktop/desktop-web/src/main/resources/static/
rm -rf /home/HouXinLin/projects/java/cool/CoolDesktop/desktop-web/build/libs/*



