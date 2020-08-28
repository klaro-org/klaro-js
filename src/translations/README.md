# Klaro Translation Files

This directory contains YAML-based translations for Klaro. We partially auto-generate translations
from our reference language (English).

## Guidelines

If you want to add a new translation string to Klaro, please add it to `en.ref.yml` first and then
manually generate an entry in `en.yml`. You can add the `|capitalize` filter to the key in order to
ensure that the string will be capitalized in all Klaro languages.

## Missing Translations

We try to keep translation files in sync by automatically removing obsolete translations and
marking missing translation strings. A missing translation will be indicated by an empty string ''
in the given key. An key with name `[original_key]_en` will be added, containing the English
translation for the missing key (so you won't have to look it up by hand to know what should go there).
You can simply add the missing translation and remove the `_en` key.
