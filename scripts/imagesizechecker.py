import os
import argparse

IMAGE_FORMATS = ('.png', '.jpg', '.jpeg', '.svg')
KILOBYTE_SIZE = 1000


def verify_image_size(file, max_size):
    if file.path.endswith(IMAGE_FORMATS):
        file_stat = file.stat()
        size_valid = file_stat.st_size <= max_size
        print("OK  " if size_valid else "ERR. FILE SIZE TOO LARGE  ", end="")
        print(" File Size: " + str(file_stat.st_size), end="")
        print("  " + file.path)

        return size_valid
    return True


def iterate_image_sizes(path, max_size):
    oversized_count = 0
    for entry in os.scandir(path):
        if entry.is_file():
            if verify_image_size(entry, max_size):
                oversized_count += 1
        elif entry.is_dir():
            oversized_count += iterate_image_sizes(entry.path, max_size)
    return oversized_count


def main():
    arg_parser = argparse.ArgumentParser(description="Verifies image file size is valid")
    arg_parser.add_argument("path", type=str, help="The path to scan in")
    arg_parser.add_argument("max_size", type=int, help="The max size of a file in kilobytes")

    args = vars(arg_parser.parse_args())

    oversized_count = iterate_image_sizes(args["path"], args["max_size"] * KILOBYTE_SIZE)

    if oversized_count == 0:
        print("\nfile sizes valid.")
    else:
        print("\n{} files are too large.".format(oversized_count))
        exit(1)


if __name__ == '__main__':
    main()
