from helpers import serialize_text, deserialize_text, translate, hash
import yaml
import sys
import os
import re

class DB:

    def __init__(self, path):
        self.path = path
        self.db = {}

    def load(self):
        if os.path.exists(self.path):
            with open(self.path) as input_file:
                self.db = yaml.load(input_file.read(), Loader=yaml.BaseLoader)

    def get(self, language, key):
        return self.db.get(language, {}).get(key)

    def set(self, language, key, hv):
        if not language in self.db:
            self.db[language] = {}
        self.db[language][key] = hv
        # we immediately write the DB to disk
        self.write()

    def write(self):
        with open(self.path, "wb") as output_file:
            output_file.write(yaml.dump(self.db, encoding='utf-8', allow_unicode=True, indent=2, sort_keys=True))

def deserialize_struct(struct, translated=False):
    for k, v in struct.items():
        if isinstance(v, str):
            if not translated:
                # we make a roundtrip to remove translation markup...
                struct[k] = deserialize_text(serialize_text(v))
            #  if there are <tr-snip> tags, we only return the text within them.
            if re.match(r".*<tr-snip>", v):
                snippets = []
                for m in re.finditer(r"<tr-snip>([^<]+?)</tr-snip>", v):
                    snippets.append(m.group(1).strip())
                struct[k] = " ".join(snippets)
        else:
            deserialize_struct(v, translated=translated)
    return process_filters(struct)

filtermap = {
    'capitalize' : lambda v : " ".join([vv.capitalize() if i == 0 else vv for (i, vv) in enumerate(v.split(" ")) ]),
}

def process_filters(struct):
    filtered_struct = {}
    for k, v in struct.items():
        kp = k.split("|")
        kr = kp[0]
        filters = kp[1:]
        if isinstance(v, str):
            for filter in filters:
                if not filter in filtermap:
                    sys.stderr.write(f"Unknown filter: {filter}\n")
                    continue
                v = filtermap[filter](v)
            filtered_struct[kr] = v
        else:
            filtered_struct[k] = process_filters(v)
    return filtered_struct

def translate_struct(ref_lang, target_lang, ref_struct, target_struct, db, token, parent_key=None):
    for k, v in ref_struct.items():
        kp = k.split("|")
        kr = kp[0]
        full_key = kr if parent_key is None else f'{parent_key}.{kr}'
        if isinstance(v, str):
            kh = hash(v)
            rh = db.get(target_lang, full_key)
            if rh == kh:
                continue # translation is still up-to-date
            print(f"Translating {full_key} from {ref_lang} to {target_lang}...")
            try:
                if target_lang == ref_lang:
                    translation = deserialize_text(serialize_text(v))
                else:
                    translation = deserialize_text(translate(serialize_text(v), ref_lang, target_lang, token))
            except:
                print("Cannot translate, skipping...")
                continue
            target_struct[k] = translation
            db.set(target_lang, full_key, kh)
        else:
            if not isinstance(target_struct.get(k), dict):
                target_struct[k] = {}
            translate_struct(ref_lang, target_lang, v, target_struct[k], db, token, parent_key=full_key)
    return target_struct

def update_translations(translations_path, ref_lang, token):
    """
    - We load the reference English translations from {ref_lang}.ref.yml
    - We load the translation cache from src/translations/{ref_lang}.trans
    - We generate translations for all target languages based on the keys in
      the reference language translations file.
    - We post-process and store the translations.
    - We also post-process the reference translations and store them.
    """
    ref_translations_path = os.path.join(translations_path, f"{ref_lang}.ref.yml")
    ref_translations_generated_path = os.path.join(translations_path, f"{ref_lang}.yml")
    db_path = os.path.join(translations_path, f"{ref_lang}.trans")
    db = DB(db_path)
    db.load()
    with open(ref_translations_path) as input_file:
        ref_translations = yaml.load(input_file.read(), Loader=yaml.BaseLoader)
    for target_lang in TARGET_LANGS:
        target_lang_translations_path = os.path.join(translations_path, f"{target_lang}.yml")
        if os.path.exists(target_lang_translations_path):
            with open(target_lang_translations_path) as input_file:
                target_translations = yaml.load(input_file.read(), Loader=yaml.BaseLoader)
        else:
            target_translations = {}
        translate_struct(ref_lang, target_lang, ref_translations, target_translations, db, token)
        with open(target_lang_translations_path, "wb") as output_file:
            output_file.write(f"# Warning, this file is partially automatically generated!\n".encode("utf-8"))
            output_file.write(yaml.dump(deserialize_struct(target_translations, True), encoding='utf-8', allow_unicode=True, indent=2, sort_keys=True))
    with open(ref_translations_generated_path, "wb") as output_file:
        output_file.write(f"# Warning, this file is automatically generated from '{ref_lang}.ref.yml', edit that file instead!\n".encode("utf-8"))
        output_file.write(yaml.dump(deserialize_struct(ref_translations), encoding='utf-8', allow_unicode=True, indent=2, sort_keys=True))

TRANSLATIONS_PATH = os.environ.get('TRANSLATIONS') or os.path.join(os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src')), 'translations')
TOKEN = os.environ.get('TOKEN')
REF_LANG = "en"
TARGET_LANGS = ["es", "de", "fr", "pt", "it", "nl", "pl", "zh"]
#TARGET_LANGS = ["de", "fr"]
if __name__ == '__main__':
    if len(sys.argv) > 1:
        TARGET_LANGS = sys.argv[1].split(",")
    if not TOKEN:
        sys.stderr.write(f"Please provide a DeepL token in the 'TOKEN' environment variable.\n")
        sys.exit(-1)
    update_translations(TRANSLATIONS_PATH, REF_LANG, TOKEN)
