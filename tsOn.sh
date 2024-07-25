#!/bin/bash
su -c "./home/ts3server/ts3server st ; svn update" -m "$ts3server"
echo -n "INFO: started ts3 server."
