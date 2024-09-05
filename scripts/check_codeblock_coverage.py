import sys, os, re, argparse
from dataclasses import dataclass


@dataclass
class CodeBlock:
    start: int
    file: str
    langs: list[str]


def get_all_rst_files(dir):
    files = []
    for root, dirs, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith(".rst"):
                files.append(os.path.join(root, filename))

    return files


def is_codeblock(line: str):
    return line.startswith(".. tab-set-code::") or line.startswith(".. tab-set::")


def get_blocks_from_rst_file(file: str):
    blocks = []
    with (open(file, "r", encoding="utf8")) as f:
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
                        "(`{3}|:language: )(java|python|c\\+\\+)", line.lower()
                    )
                    if lang is not None:
                        langs.append(lang.group(2))
    return blocks


def generate_report(
    blocks: list[CodeBlock], langs: list[str], wordy: bool, output: str
):
    stream = sys.stdout
    if wordy:
        stream = open(output, "w")

    blocks_count = len(blocks)
    langs_coverage = {lang: 0 for lang in langs}
    for block in blocks:
        for lang in langs:
            if lang in block.langs:
                langs_coverage[lang] += 1
    print(f"Total code blocks: {blocks_count}", file=stream)
    for lang, coverage in langs_coverage.items():
        print(
            f"{lang} coverage: {coverage}/{blocks_count} ({coverage/blocks_count*100:.2f}%)",
            file=stream,
        )

    if wordy:
        print("\n\nMissing code blocks:", file=stream)
        for block in blocks:
            missing_langs = [lang for lang in langs if lang not in block.langs]
            if missing_langs:
                print(f"File: {block.file}, Line: {block.start}", file=stream)
                print(f"Missing languages: {missing_langs}", file=stream)

        stream.close()


def main():
    parser = argparse.ArgumentParser(
        description="Check code block coverage in FRC docs"
    )
    parser.add_argument("--dir", type=str, help="Directory to search for rst files")
    parser.add_argument(
        "--wordy",
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
        default=["java", "python", "c++"],
        help="Languages to check for",
    )

    args = parser.parse_args()
    print(args.wordy)

    files = get_all_rst_files(dir=args.dir)
    blocks = []
    for file in files:
        file_blocks = get_blocks_from_rst_file(file)
        if len(file_blocks) == 0:
            continue
        else:
            blocks.extend(file_blocks)
    generate_report(
        blocks=blocks, langs=args.langs, wordy=args.wordy, output=args.output
    )


if __name__ == "__main__":
    main()
