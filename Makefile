build: klaro klaro-no-css

klaro:
	npm run-script make

klaro-no-css:
	SEPARATE_CSS=1 npm run-script make

publish: build
	npm publish