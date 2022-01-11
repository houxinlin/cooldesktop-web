#!/bin/sh

cd /home/HouXinLin/project/vue/Desktop/Desktop/
npm run build
rm -rf /home/HouXinLin/project/java/CoolDesktop/desktop-web/src/main/resources/static/*
cp -r ./dist/* /home/HouXinLin/project/java/CoolDesktop/desktop-web/src/main/resources/static/
cd /home/HouXinLin/project/java/CoolDesktop
rm -rf /home/HouXinLin/project/java/CoolDesktop/desktop-web/build/libs/*
exec ./gradlew :desktop-web:bootjar



