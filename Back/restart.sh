#!/bin/bash

LOG=/puffu/back.log

PID=$(ps -ef | grep app.js | grep usr | awk '{print $2}')

if [ -z "$PID" ];

then

    echo "Progress is not running"

else

    kill -9 $PID

    echo "Progess stopped."
fi

echo "Express Back Start"
nohup yarn run start >> $LOG 2>&1 &
