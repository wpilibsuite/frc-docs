import os
import argparse
import re
from pathlib import Path
import urllib.request

# # URL_REGEX FROM:
# https://mathiasbynens.be/demo/url-regex


URL_REGEX = re.compile(
    "((https?):((//)|(\\\\))+([\w\d:#@%/;$()~_?\+-=\\\.&](#!)?)*)", re.DOTALL
)

# Grab RemoteLiteralIncludes from .rst resources
# Return the URLs in the RLIs
def grab_rli_urls(path: str):
    # retrieve list of rst documents
    documents = Path(path).glob("**/*.rst")

    # retrieve list of rlis
    rli_urls = {}
    for document in documents:
        with open(documents[document], "r", encoding="utf8") as parsed_document:
            for num, line in enumerate(parsed_document):
                if ".. remoteliteralinclude" in line or ".. rli" in line:
                    url = re.findall(URL_REGEX, line)[0][0]

                    # only run check on allwpilib lines
                    if "allwpilib" in line:
                        rli_urls[document + "#" + str(num)] = url

    return rli_urls


# Verifies that the file has changed between current and target
def verify_diff(rli_urls: list, target_branch: str):
    err = False
    for url in rli_urls:
        source_url = rli_urls[url]
        split_url = source_url.split("/")

        if "raw" in split_url:
            split_url.remove("raw")

        # grab the branch from the fifth slash in the URL
        split_url[5] = target_branch

        target_url = "/".join(split_url)

        source_text = ""
        try:
            with urllib.request.urlopen(source_url) as source:
                source_text = source.read()
        except urllib.request.HTTPError as e:
            print("ERROR RETRIEVING URL ON LINE", url, "WITH CODE", e.code)
            err = True

            continue

        target_text = ""
        try:
            with urllib.request.urlopen(target_url) as target:
                target_text = target.read()

        except urllib.request.HTTPError as e:
            print("ERROR RETRIEVING URL ON LINE", url, "WITH CODE", e.code)
            err = True

            continue

        if source_text.strip() not in target_text.strip():
            print(url, "is not updated!")
            err = True

    if err:
        exit(1)


def main():
    arg_parser = argparse.ArgumentParser(
        description="Verifies that RLI have not changed since master"
    )
    arg_parser.add_argument("path", type=str, help="Source directory path")
    arg_parser.add_argument("target_branch", type=str, help="Git branch to target")

    args = vars(arg_parser.parse_args())

    print("Retrieving RemoteLiteralIncludes")
    print("====")
    rli_urls = grab_rli_urls(args["path"])

    print("Verifying Diff")
    print("====")
    verify_diff(rli_urls, args["target_branch"])
    print("No issues detected!")


if __name__ == "__main__":
    main()
