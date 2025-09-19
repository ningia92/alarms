#!/bin/bash

# set this script as cronjob with the command --> crontab -e
# inside the file opened by this command insert the following line:
# 0 0 1 4 * /bin/bash clear-logs.sh
# then make this file executable with --> chmod 755 clear-logs.sh

# clear log file into alarms-backend container
docker exec alarms-backend rm logs/alarm-logs.txt