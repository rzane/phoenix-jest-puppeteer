process.stdin.on('end', () => process.exit(0));
process.stdin.resume();
require('parcel-bundler/bin/cli');
