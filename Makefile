build: klaro klaro-no-css

RT=patch

release:
	@echo "Making a '${RT}' release (change by setting RELEASE=patch|minor|major)"
	@git  diff --quiet || (echo "working directory not clean" && exit 1)
	make build
	python3 .scripts/update_version.py

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make

publish: build
	npm publish
