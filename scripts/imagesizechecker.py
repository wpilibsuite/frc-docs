import os
import argparse
import importlib

IMAGE_FORMATS = (".png", ".jpg", ".jpeg", ".svg")
KILOBYTE_SIZE = 1000


def clean_module_path(path):
    return (
        (path[: -len(".py")] if path.endswith(".py") else path)
        .replace("/", ".")
        .replace("\\", ".")
    )


def verify_image_size(file, max_size, excluded_files):
    if file.path.lower().endswith(IMAGE_FORMATS):
        if excluded_files is not None:
            if file.path.replace("\\", "/").lower().endswith(tuple(excluded_files)):
                return True

        file_size = file.stat().st_size

        if not file_size <= max_size:
            print(
                "FILE SIZE IS TOO LARGE   File Size: {}  Path: {}".format(
                    file_size, file.path
                )
            )
            return False

    return True


def iterate_image_sizes(path, max_size, excluded_files):
    oversized_count = 0
    for entry in os.scandir(path):
        if entry.is_file():
            if not verify_image_size(entry, max_size, excluded_files):
                oversized_count += 1
        elif entry.is_dir():
            oversized_count += iterate_image_sizes(entry.path, max_size, excluded_files)
    return oversized_count


def main():
    arg_parser = argparse.ArgumentParser(
        description="verifies image file size is valid"
    )
    arg_parser.add_argument("path", type=str, help="the path to scan in")
    arg_parser.add_argument(
        "max-size", type=int, help="the max size of a file in kilobytes"
    )
    arg_parser.add_argument(
        "--exclude-file",
        "-e",
        type=str,
        default=None,
        help="python file containing IMAGE_SIZE_EXCLUSIONS list",
    )

    args = vars(arg_parser.parse_args())

    print("Running SizeCheck")
    print("Specified Size: {}KB".format(args["max-size"]))
    print("Scan Directory: {}".format(args["path"]))

    # Gets excluded files from conf.py
    exclude_file = args["exclude_file"]
    if exclude_file is not None:
        conf = importlib.import_module(clean_module_path(exclude_file))

        if hasattr(conf, "IMAGE_SIZE_EXCLUSIONS"):
            excluded_files = list(getattr(conf, "IMAGE_SIZE_EXCLUSIONS"))
        else:
            excluded_files = None

        print("Exclusion Config: {}".format(exclude_file))
    else:
        excluded_files = list()

    # Check how many images are too big
    oversized_count = iterate_image_sizes(
        args["path"], args["max-size"] * KILOBYTE_SIZE, excluded_files
    )

    if oversized_count == 0:
        print("\nNo files bigger than {}KB have been found.".format(args["max-size"]))
    else:
        print(
            "\n{} files are bigger than {}KB.".format(oversized_count, args["max-size"])
        )
        exit(1)


if __name__ == "__main__":
    main()
