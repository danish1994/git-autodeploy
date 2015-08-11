#!/bin/sh
kill $(ps aux | grep 'git_auto_deploy' | awk '{print $2}') || true

