import requests
import hashlib
import logging
import base64
import re

logger = logging.getLogger(__name__)

def hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]

def serialize_code(match):
    """
    We retain the original value inside because it can provide meaningful context
    to the translation API. However, we ignore the translated value.
    """
    return f"<md-code>{match.group(1)}</md-code>"

def serialize_ignore(match):
    # brackets don't match, we ignore this
    if len(match.group(2)) != len(match.group(4)):
        return match.group(0)
    # we don't replace anything that's already inside an HTML tag
    if re.match(r".*?<[^>]*$", match.group(1)):
        return match.group(0)
    bi = base64.urlsafe_b64encode((match.group(2)+match.group(3)+match.group(4)).encode("utf-8")).decode("ascii")
    return f"{match.group(1)}<tr-ignore v=\"{bi}\" />"

def deserialize_ignore(match):
    bs = base64.urlsafe_b64decode(match.group(1)).decode("utf-8")
    return bs

def serialize_md_link(match):
    if len(match.groups()) == 2:
        bi = base64.urlsafe_b64encode(match.group(2).encode("utf-8")).decode("ascii")
        return f"<md-link href=\"{bi}\">{match.group(1)}</md-link>"
    else:
        return f"<md-link>{match.group(1)}</md-link>"

def deserialize_md_link(match):
    if len(match.groups()) == 2:
        bs = base64.urlsafe_b64decode(match.group(1)).decode("utf-8")
        return f"[{match.group(2)}]({bs})"
    else:
        return f"[{match.group(1)}]"
    return bs

def serialize_tr_hint(match):
    bi = base64.urlsafe_b64encode(match.group(2).encode("utf-8")).decode("ascii")
    return f"<tr-hint v=\"{bi}\">{match.group(1)}</tr-hint>"

def deserialize_tr_hint(match):
    bs = base64.urlsafe_b64decode(match.group(1)).decode("utf-8")
    return bs

def deserialize_text(text):
    """
    Undoes what the serialization did below.
    """

    # sometimes space after/before XML tags gets removed, we fix that here
    # after
    text = re.sub(r"</([a-zA-Z\-]+)>([^$\,\.\;\<\n\s\(\)\]\[])", "</\\1> \\2", text)
    # before
    text = re.sub(r"([\,\.\;\)a-zA-Z0-9])<([a-zA-Z])", "\\1 <\\2", text)

    text = re.sub(r"<tr-hint\s+v=\"(.*?)\"\s*>(.*?)</tr-hint>", deserialize_tr_hint, text)
    text = re.sub(r"<md-heading\s+v=\"(.*?)\"\s*>(.*?)</md-heading>", "\\1 \\2", text)
    text = re.sub(r"<md-list\s+v=\"(.*?)\"\s*>(.*?)</md-list>", "\\1 \\2", text)
    text = re.sub(r"<md-it>(.*?)</md-it>", "*\\1*", text)
    text = re.sub(r"<md-strong>(.*?)</md-strong>", "**\\1**", text)
    text = re.sub(r"<md-code>(.*?)</md-code>", "`\\1`", text)
    text = re.sub(r"<md-strong-it>(.*?)</md-strong-it>", "***\\1***", text)
    text = re.sub(r"<md-link\s+href=\"(.*?)\"\s*>(.*?)</md-link>", deserialize_md_link, text)
    text = re.sub(r"<md-link>(.*?)</md-link>", deserialize_md_link, text)
    # ignore needs to be deserialized last, as it can occur encoded e.g. in a
    # markdown link that was converted itself...
    text = re.sub(r"<tr-ignore\s+v=\"(.*?)\"\s*/>", deserialize_ignore, text)
    text = text.replace("&amp;", "&")
    return text

def serialize_text(text):
    """
    Serializes text so that DeepL can effectively translate it.

    Currently, this replaces both common Markdown directives and some Jinja
    directives that might get in the way of a proper translation.
    """
    return serialize_plaintext(text)

def serialize_plaintext(text):
    # we ignore everything inside backticks

    text = re.sub(r"`(.*?)`", serialize_code, text)
    text = re.sub(r"<tr-hint\s+v=\"(.*?)\"\s*>(.*?)</tr-hint>", serialize_tr_hint, text)

    # we ignore everything inside unescaped brackets ({...})
    text = re.sub(r"^(.*?)((?:(?!\\)\{)+)(.*?)((?:(?!\\)\})+)", serialize_ignore, text)
    # we replace Markdown headings
    text = re.sub(r"^(\#+)\s*(.*?)$", "<md-heading v=\"\\1\">\\2</md-heading>", text, re.MULTILINE)
    # we replace Markdown list elements
    text = re.sub(r"^(\s*\*|\-|\d+\.)\s+(.*?)$", "<md-list v=\"\\1\">\\2</md-list>", text, re.MULTILINE)
    # we replace strong, italicized and strong italicized text
    text = re.sub(r"(?:(?![\\])\*){3}([^\*\n]+)(?:(?![\\])\*){3}", "<md-strong-it>\\1</md-strong-it>", text)
    text = re.sub(r"(?:(?![\\])\*){2}([^\*\n]+)(?:(?![\\])\*){2}", "<md-strong>\\1</md-strong>", text)
    text = re.sub(r"(?:(?![\\])\*){1}([^\*\n]+)(?:(?![\\])\*){1}", "<md-it>\\1</md-it>", text)

    # we replace Markdown links
    text = re.sub(r"(?!\\)\[([^\]]+?)(?!\\)\](?!\\)\(([^\)]+?)(?!\\)\)",serialize_md_link
        , text)
    text = re.sub(r"(?!\\)\[([^\]]+?)(?!\\)\]",
        serialize_md_link, text)

    return text

def translate(text, source_language, target_language, token):
    """
    We use the DeepL translation service to translate texts into a supported
    language.
    """
    logger.info(f"Translating: '{text}'")
    response = requests.post("https://api.deepl.com/v2/translate", data={
        "auth_key": token,
        "text": text,
        "source_lang": source_language,
        "target_lang": target_language,
        "preserve_formatting": "0",
        # formality currently doesn't work for Chinese, Spanish and Japanese
        # To do: Regularly check if this is still true...
        "formality": "more" if target_language not in ['es', 'zh', 'ja'] else "default",
        "ignore_tags": "tr-ignore,code,md-code",
        "tag_handling": "xml",
        })
    if response.status_code != 200:
        logger.error(response.json())
        response.raise_for_status()
    translation = response.json()["translations"][0]["text"]
    logger.info(f"Translation: '{translation}'")
    return translation
