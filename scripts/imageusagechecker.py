import os
import sys
import hashlib
import argparse
import importlib
import re

IMAGE_FORMATS = ['.png', '.jpg', '.svg']


def clean_module_path(path):
    return (path[:-len(".py")] if path.endswith(".py") else path).replace("/", ".").replace("\\", ".")


def build_hashes(dir):
    located_files = {}

    for root, subFolders, files in os.walk(dir):
        for file in files:
            filename, file_extension = os.path.splitext(file)

            if file_extension in IMAGE_FORMATS:
                filepath = os.path.join(root, file)
                with open(filepath, 'rb') as afile:
                    hasher = hashlib.md5()

                    hasher.update(afile.read())
                    located_files[filepath] = hasher.hexdigest()

    return located_files


def main():
    arg_parser = argparse.ArgumentParser(description="Compares the usage of an image given two directories.")
    arg_parser.add_argument("source", type=str, help="The image source directory")
    arg_parser.add_argument("output", type=str, help="The image output directory")
    arg_parser.add_argument("--exclude-file", "-e", type=str, default=None, help="Sphinx file containing document exclusions.")

    args = vars(arg_parser.parse_args())

    print("Directory One:", args["source"])
    print("Directory Two:", args["output"])
    print("Configuration Path:", args["exclude_file"])

    source_hashes = build_hashes(args["source"])
    output_hashes = build_hashes(args["output"])
    exclude_file = args["exclude_file"]

    if exclude_file is not None:
        excluded_regex = "|".join(list(importlib.import_module(clean_module_path(exclude_file)).exclude_patterns))
    else:
        excluded_regex = list()

    err = False

    print("Starting Image Scan\n")

    for file_path in source_hashes.keys():
        posix_path = file_path.replace('\\', '/').lower()
        if re.compile(excluded_regex).search(posix_path) is None:
            if source_hashes[file_path] not in output_hashes.values():
                print(file_path + " is not currently used!")
                err = True

    if err:
        exit(1)
    else:
        print("Scan has completed with no issues!")


if __name__ == "__main__":
    main()
