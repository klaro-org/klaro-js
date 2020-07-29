build: klaro klaro-no-css

RT=patch

release:
	@echo "Making a '${RT}' release (change by setting RT=patch|minor|major)"
	@git  diff --quiet || (echo "working directory not clean" && exit 1)
	python3 .scripts/update_version.py ${RT}

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make

publish: build
	npm publish
