#!/bin/bash
set -x

openssl aes-256-cbc -K $encrypted_92725ca94bf5_key -iv $encrypted_92725ca94bf5_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc # Don't need it anymore
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa
