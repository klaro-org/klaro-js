build: klaro klaro-no-css

RT=patch

release:
	@echo "Making a '${RT}' release (change by setting RELEASE=patch|minor|major)"
	# @git  diff --quiet || (echo "working directory not clean" && exit 1)
	#make build
	VERSION=$(python .scripts/update_version.py ${RT}); \
	echo  ${VERSION}
	exit  0
	#git add .
	#git commit -m "v${VERSION}"
	#git tag -a v${VERSION} -m v${VERSION}

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make

publish: build
	npm publish
