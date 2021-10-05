#!/bin/bash

function build_tailwind() {
	echo "running tailwindcss..."
	npx tailwindcss build --input tailwind.scss --config tailwind.config.js --output "$1"
}

if [ "$NODE_ENV"  == "production" ]; then
	echo "NODE_ENV is production. Output will be small which is good 👌"

	build_tailwind "tailwind.css"
	# Actual minify work is done by ng build command
else
	echo "NODE_ENV is NOT production (actual value is \"$NODE_ENV\"). Output will be BIG"

	if [ ! -f "tailwind.css" ]; then
		build_tailwind "tailwind.css"
	else
		echo "tailwindcss build was skipped because file tailwind.css already exists"
	fi
fi
