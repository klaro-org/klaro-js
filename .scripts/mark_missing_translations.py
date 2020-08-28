from helpers import serialize_text, deserialize_text, translate, hash
import yaml
import sys
import os
import re

class NullWithComment:

    def __init__(self, comment):
        self.comment = comment

def mark_missing(d, ed, ref_lang, parent_key=None):
    for k, v in list(ed.items()):
        full_key = k if parent_key is None else f"{parent_key}.{k}"
        if not k in d:
            print(f"Deleting {full_key}")
            # this key doesn't exist in the reference translation file, we
            # delete it from the language translations
            del ed[k]
    for k, v in d.items():
        full_key = k if parent_key is None else f"{parent_key}.{k}"
        if not k in ed or not ed[k]:
            print(f"Marking {full_key} as None")
            if isinstance(v, dict):
                ed[k] = {}
            else:
                ed[k] = ''
                ed[k+f'_{ref_lang}'] = d[k]
        if isinstance(v, dict):
            if not isinstance(ed[k], dict):
                print(f"Converting key {full_key} to dict...")
                ed[k] = {}
            mark_missing(v, ed[k], ref_lang, parent_key=full_key)
        elif ed[k] is not None:
            if not isinstance(ed[k], str):
                raise ValueError(f"Expected a string for key {full_key}")
                # we perform some normalizations
            ed[k] = ed[k].strip()
            if v.capitalize() == v and ed[k].capitalize() != ed[k].capitalize():
                ed[k] = ed[k].capitalize()
            if v.endswith(".") and not ed[k].endswith(".") and not ed[k].endswith("。"):
                ed[k] += "."
            if not v.endswith(".") and ed[k].endswith("."):
                ed[k] = ed[k][:-1]

def mark_missing_translations(src_path, ref_lang):
    translations_path = os.path.join(src_path, "translations")
    ref_translations_path = os.path.join(translations_path, f"{ref_lang}.yml")
    with open(ref_translations_path) as input_file:
        ref_translations = yaml.load(input_file.read(), Loader=yaml.BaseLoader)

    for filename in os.listdir(os.path.join(translations_path)):
        if re.match(r"^[a-z]{2}\.yml$", filename) and filename != f"{ref_lang}.yml":
            full_path = os.path.join(translations_path, filename)
            with open(full_path) as input_file:
                lang_translations = yaml.load(input_file.read(), Loader=yaml.BaseLoader)
            mark_missing(ref_translations, lang_translations, ref_lang)
            new_data = yaml.dump(lang_translations, indent=2, allow_unicode=True, sort_keys=True, encoding='utf-8')
            with open(full_path, "wb") as output_file:
                output_file.write(new_data)



SRC_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
REF_LANG = "en"
if __name__ == '__main__':
    mark_missing_translations(SRC_PATH, REF_LANG)