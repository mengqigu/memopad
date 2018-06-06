#!/bin/sh

rsync -av --exclude='deploy.sh' --exclude='composer.lock' --exclude='vendor' --exclude='.git' --exclude='.gitignore' . ~/Sites/nextcloud/apps/memopad
