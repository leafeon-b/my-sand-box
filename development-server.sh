#!/bin/bash
#
# 開発用にビルドと起動を行うスクリプト

set -eu

function main() {
  npm run build
  npm run serve
}

main
