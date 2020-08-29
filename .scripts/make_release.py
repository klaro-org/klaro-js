import re
import os
import sys
import json
import yaml
import base64
import hashlib
import subprocess

wd = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
package_path = os.path.join(wd, "package.json")
releases_yml_path = os.path.join(wd, "releases.yml")
releases_json_path = os.path.join(wd, "releases.json")

build_path = os.path.join(wd, "dist")

# this forces pyyaml to produce cleaner looking strings
# https://stackoverflow.com/questions/8640959/how-can-i-control-what-scalar-form-pyyaml-uses-for-my-data
def str_presenter(dumper, data):
  if len(data.splitlines()) > 1:  # check for multiline string
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
  return dumper.represent_scalar('tag:yaml.org,2002:str', data)

yaml.add_representer(str, str_presenter)

def hash_file(filename, methods=[hashlib.sha256]):
    d = {}
    with open(filename, "rb") as file:
        c = file.read()
        for method in methods:
            # a bit hacky but it works...
            d[method.__name__.split("_")[1]] = base64.b64encode(method(c).digest()).decode("ascii")
    return d

if __name__ == '__main__':
    if len(sys.argv) == 1:
        rt = 'patch'
    else:
        rt = sys.argv[1]
    if not rt in ('patch', 'minor', 'major'):
        sys.stderr.write("usage: {} patch|minor|major".format(sys.argv[0]))
        exit(1)
    with open(package_path) as input_file:
        config = json.load(input_file)
    with open(releases_yml_path) as input_file:
        releases = yaml.load(input_file.read(), Loader=yaml.BaseLoader)
    match = re.match(r"^(\d+)\.(\d+)\.(\d+)$", config['version'])
    if not match:
        sys.stderr.write("version {} does not match!".format(config['version']))
        exit(1)
    patch_version, minor_version, major_version = int(match.group(3)), int(match.group(2)), int(match.group(1))
    if rt == 'patch':
        patch_version += 1
    elif rt == 'minor':
        minor_version += 1
        patch_version = 0
    elif rt == 'major':
        major_version += 1
        minor_version = 0
        patch_version = 0
    v = f"{major_version}.{minor_version}.{patch_version}"
    for release in releases:
        if not "version" in release:
            continue
        if release["version"] == v:
            if (release.get("changelog") and release.get("date") and
                re.match(r'^\d{4}\-\d{2}\-\d{2}$', release["date"]) and
                release.get("tags") is not None and isinstance(release["tags"], (list, tuple))):
                break
    else:
        sys.stderr.write(f"please add a proper entry for version '{v}'in the releases YAML file (releases.yml)\n")
        exit(-1)

    env = os.environ.copy()
    env['APP_VERSION'] = v
    subprocess.check_output(["make", "build"], cwd=wd, env=env)

    # everything below here should not fail anymore...

    # we add the SHA sums of the files to the release (can be used for
    # subresource integrity)
    files = []
    for filename in os.listdir(build_path):
        if not filename.endswith('.css') and not filename.endswith('.js'):
            continue
        d = {
            "name" : filename,
        }
        d.update(hash_file(os.path.join(build_path, filename),
            methods=[hashlib.sha384]))
        files.append(d)
    release["files"] = files
    with open(releases_yml_path, 'wb') as output_file:
        output_file.write(yaml.dump(releases, allow_unicode=True, encoding='utf-8', indent=2, sort_keys=True, default_flow_style=False))

    # we update the JSON releases file to reflect the YAML one
    with open(releases_json_path, 'w') as output_file:
        json.dump(releases, output_file, indent=2, sort_keys=True)

    # we update the package file
    config['version'] = v
    with open(package_path, 'w') as output_file:
        json.dump(config, output_file, indent=2, sort_keys=True)

    subprocess.check_output(["git", "add", "."], cwd=wd)
    subprocess.check_output(["git", "commit", "-m", f"v{v}"], cwd=wd)
    subprocess.check_output(["git", "tag", "-a", f"v{v}", "-m", f"v{v}"], cwd=wd)
    subprocess.check_output(["git", "push", "origin", "master", "--tags"], cwd=wd)
    subprocess.check_output(["git", "push", "geordi", "master", "--tags"], cwd=wd)
