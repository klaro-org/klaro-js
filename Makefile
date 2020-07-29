build: klaro klaro-no-css

release:
	@git  diff --quiet || (echo "working directory not clean" && exit 1)
	make build
	sed -i 's/"version":\s*".*"/\"version\": "${VERSION}"/' package.json
	git add .
	git commit -m "v${VERSION}"
	git tag -a v${VERSION} -m v${VERSION}

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make

publish: build
	npm publish
