#!/bin/sh

cd /home/HouXinLin/project/vue/Desktop/Desktop/
npm run build
rm -rf /home/HouXinLin/project/java/CoolDesktop/Desktop-Web/src/main/resources/static/*
cp -r ./dist/* /home/HouXinLin/project/java/CoolDesktop/Desktop-Web/src/main/resources/static/
cd /home/HouXinLin/project/java/CoolDesktop
exec ./gradlew :Desktop-Web:bootjar
scp /home/HouXinLin/project/java/CoolDesktop/Desktop-Web/build/libs/Desktop-Web.jar root@123.56.178.1:/home/HouXinLin/jar
echo "完成"


