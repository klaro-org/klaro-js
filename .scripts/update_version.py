import re
import os
import sys
import json
import subprocess

wd = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
package_path = os.path.join(wd, "package.json")

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
    match = re.match(r"^(\d+)\.(\d+)\.(\d+)$", config['version'])
    if not match:
        sys.stderr.write("version {} does not match!".format(config['version']))
        exit(1)
    patch_version, minor_version, major_version = int(match.group(3)), int(match.group(2)), int(match.group(1))
    if rt == 'patch':
        patch_version += 1
    elif rt == 'minor':
        minor_version += 1
    elif rt == 'major':
        major_version += 1
    v = f"{major_version}.{minor_version}.{patch_version}"
    config['version'] = v
    with open(package_path, 'w') as output_file:
        json.dump(config, output_file, indent=2, sort_keys=True)
    subprocess.check_output(["make", "build"], cwd=wd, env={'APP_VERSION': v})
    subprocess.check_output(["git", "add", "."], cwd=wd)
    subprocess.check_output(["git", "commit", "-m", f"v{v}"], cwd=wd)
    subprocess.check_output(["git", "tag", "-a", f"v{v}", "-m", f"v{v}"], cwd=wd)
