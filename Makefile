build: klaro klaro-no-css

RT=patch

release:
	@echo "Making a '${RT}' release (change by setting RT=patch|minor|major)"
	@git  diff --quiet src || (echo "source directory not clean" && exit 1)
	@npm run-script lint-fix || (echo "fix your errors first" && exit 1)
	python3 .scripts/make_release.py ${RT}

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make
	SEPARATE_CSS=1 NO_MINIFY_CSS=1 npm run-script make

publish: build
	npm publish
