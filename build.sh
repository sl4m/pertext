#!/bin/bash

set -euo pipefail

BUILD="build"
EXT_NAME=$(basename $PWD)

echo "Clean and set up build dir..."
rm -rf $BUILD
mkdir -p $BUILD/images

echo "Pack js..."
echo "(function() {" >> $BUILD/$EXT_NAME.js
cat lib/pert.js >> $BUILD/$EXT_NAME.js
cat lib/pertext.js >> $BUILD/$EXT_NAME.js
cat lib/init.js >> $BUILD/$EXT_NAME.js
echo "})();" >> $BUILD/$EXT_NAME.js

if [ $(which jsmin) ]; then
  echo "Minify js..."
  jsmin <$BUILD/$EXT_NAME.js >$BUILD/$EXT_NAME.min.js
  rm $BUILD/$EXT_NAME.js
else
  echo "jsmin not found, skipping minification"
  mv $BUILD/$EXT_NAME.js $BUILD/$EXT_NAME.min.js
fi

echo "Copy files..."
cp manifest.json $EXT_NAME.css $EXT_NAME.html build
find images -type f -exec cp {} $BUILD/images \;

echo "Zip files..."
zip -r build/$EXT_NAME.zip $BUILD

