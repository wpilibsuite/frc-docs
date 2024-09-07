import sys
import os
import re
import argparse
from dataclasses import dataclass


@dataclass
class CodeBlock:
    """
    A class representing a code block in an .rst file.

    Attributes:
        start (int): The starting line number of the code block.
        file (str): The file path of the .rst file.
        langs (list[str]): A list of languages found in the code block.
    """

    start: int
    file: str
    langs: list[str]


def get_all_rst_files(dir: str) -> list[str]:
    """
    Recursively searches a directory for .rst files.

    Parameters:
        dir (str): The directory path to search.

    Returns:
        list[str]: A list of file paths for .rst files.
    """
    files = []
    for root, dirs, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith(".rst"):
                files.append(os.path.join(root, filename))
    return files


def is_codeblock(line: str) -> bool:
    """
    Checks if a line in an .rst file indicates the start of a code block.

    Parameters:
        line (str): A line from the file.

    Returns:
        bool: True if the line starts a code block, False otherwise.
    """
    return line.startswith(".. tab-set-code::") or line.startswith(".. tab-set::")

def generate_language_regex(langs: list[str]) -> str:
    """
    Generates a regex pattern to match the specified languages.

    Parameters:
        langs (list[str]): A list of languages to match.

    Returns:
        str: A regex pattern to match the specified languages.
    """
    return f"(`{{3}}|:language: )({'|'.join(langs)})".replace("+", r"\+")

def get_blocks_from_rst_file(file: str, langs: list[str]) -> list[CodeBlock]:
    """
    Extracts code blocks from a given .rst file.

    Parameters:
        file (str): The path to the .rst file.

    Returns:
        list[CodeBlock]: A list of CodeBlock instances representing the code blocks in the file.
    """
    blocks = []
    lang_regex = generate_language_regex(langs)
    with open(file, "r", encoding="utf8") as f:
        block_start = None
        langs = []
        for index, line in enumerate(f):
            if is_codeblock(line):
                if langs != []:
                    blocks.append(CodeBlock(start=block_start, file=file, langs=langs))
                block_start = index + 1
                langs = []
            else:
                if line.startswith(" ") or line.startswith("\t"):
                    lang = re.search(
                        lang_regex, line.lower()
                    )
                    if lang is not None:
                        langs.append(lang.group(2))
    
    if langs != []:
        blocks.append(CodeBlock(start=block_start, file=file, langs=langs))

    return blocks


def generate_report(
    blocks: list[CodeBlock], langs: list[str], verbose: bool, output: str
):
    """
    Generates a report of code block coverage and writes it to the specified output.

    Parameters:
        blocks (list[CodeBlock]): A list of CodeBlock instances to analyze.
        langs (list[str]): A list of languages to check for.
        verbose (bool): Whether to include detailed missing code block information.
        output (str): The path to the output file.
    """
    stream = sys.stdout
    if verbose:
        stream = open(output, "w")

    blocks_count = len(blocks)
    langs_coverage = {lang: 0 for lang in langs}

    # Calculate coverage for each language
    for block in blocks:
        for lang in langs:
            if lang in block.langs:
                langs_coverage[lang] += 1

    # Print the coverage summary
    print(f"Total code blocks: {blocks_count}", file=stream)
    for lang, coverage in langs_coverage.items():
        print(
            f"{lang} coverage: {coverage}/{blocks_count} ({coverage/blocks_count*100:.2f}%)",
            file=stream,
        )

    # If verbose flag is set, print detailed information about missing code blocks
    if verbose:
        print("\n\nMissing code blocks:", file=stream)
        for block in blocks:
            missing_langs = [lang for lang in langs if lang not in block.langs]
            if missing_langs:
                print(f"File: {block.file}, Line: {block.start}", file=stream)
                print(f"Missing languages: {missing_langs}", file=stream)

        # Close the output file if it was opened
        if stream is not sys.stdout:
            stream.close()


def main():
    """
    The main entry point of the script.
    """
    # Set up argument parsing
    parser = argparse.ArgumentParser(
        description="Check code block coverage in FRC docs"
    )
    parser.add_argument("--dir", type=str, help="Directory to search for rst files")
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Outputs which code blocks are missing languages",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="output.txt",
        help="Output file for missing code blocks",
    )
    parser.add_argument(
        "--langs",
        nargs="+",
        default=['java', 'python', 'c++'],
        help="Languages to check for",
    )


    # Parse the command line arguments
    args = parser.parse_args()

    print(generate_language_regex(args.langs))

    # Get all .rst files from the specified directory
    files = get_all_rst_files(dir=args.dir)
    blocks = []
    for file in files:
        file_blocks = get_blocks_from_rst_file(file, args.langs)
        if len(file_blocks) == 0:
            continue
        else:
            blocks.extend(file_blocks)

    # Generate the report based on the collected code blocks
    generate_report(
        blocks=blocks, langs=args.langs, verbose=args.verbose, output=args.output
    )


if __name__ == "__main__":
    main()