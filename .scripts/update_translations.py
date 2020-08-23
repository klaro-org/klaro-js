from helpers import serialize_text, deserialize_text, translate, hash
import yaml
import sys
import os

class DB:

    def __init__(path):
        self.path = path
        self.db = {}

    def load(self):
        if os.path.exists(self.path):
            with open(self.path) as input_file:
                self.db = yaml.load(input_file.read())

    def get(self, language, key):
        return self.db.get(language, {}).get(key)

    def set(self, language, key, hv):
        if not language in self.db:
            self.db[language] = {}
        self.db[language][key] = hv
        # we immediately write the DB to disk
        self.write()

    def write(self):
        with open(self.path, "w") as output_file:
            output_file.write(yaml.dump(self.db, indent=2, sort_keys=True))

def translate_struct(ref_lang, target_lang, ref_struct, target_struct, db, token, parent_key=None):
    for k, v in ref_struct.items():
        full_key = k if parent_key is None else f'{parent_key}.{k}'
        if isinstance(v, str):
            kh = hash(v)
            rh = db.get(target_lang, full_key)
            if rh == kh:
                continue # translation is still up-to-date
            print(f"Translating {full_key} from {ref_lang} to {target_lang}...")
            # translation = translate(v, ref_lang, target_lang, token)
            translation = "..."
            target_struct[k] = translation
            db.set(target_lang, full_key, kh)
        else:
            if not isinstance(target_struct.get(k), dict):
                target_struct[k] = {}
            translate_struct(ref_lang, target_lang, v, target_struct[k], db, token, parent_key=full_key)

def update_translations(src_path, ref_lang, token):
    """
    - We load the reference English translations from en.yml
    - We load the translation cache from src/translations/_t.yml
    """
    ref_translations_path = os.path.join(src_path, f"translations/{ref_lang}.ref.yml")
    db_path = os.path.join(src_path, f"translations/{ref_lang}.trans")
    db = DB(db_path)
    db.load()
    with open(ref_translations_path) as input_file:
        ref_translations = yaml.load(input_file.read())

    for target_lang in TARGET_LANGS:
        target_lang_translations_path = os.path.join(src_path, f"translations/{target_lang}.yml")
        with open(target_lang_translations_path) as input_file:
            target_translations = yaml.load(input_file.read())
        translate_struct(ref_lang, target_lang, ref_translations, target_translations, db, token)

SRC_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
TOKEN = os.environ.get('TOKEN')
REF_LANG = "en"
TARGET_LANGS = ["es", "de", "fr", "pt", "it", "nl", "pl", "zh"]

if __name__ == '__main__':
    if not TOKEN:
        sys.stderr.write(f"Please provide a DeepL token in the 'TOKEN' environment variable.\n")
        sys.exit(-1)
    print(SRC_PATH)
    update_translations(SRC_PATH, REF_LANG, TOKEN)