#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_rsa
    # Initialize a new git repo in _site, and push it to our server.
    cd build
    git init

    git remote add deploy "deploy@domonicmilesi.com:/var/www/domonicmilesi.com"
    git config user.name "Travis CI"
    git config user.email "m.domonic+travisCI@gmail.com"

    git add .
    git commit -m "Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi
