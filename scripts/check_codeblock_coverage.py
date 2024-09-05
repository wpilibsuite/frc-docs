import sys, os, re
from dataclasses import dataclass

@dataclass
class CodeBlock:
    start: int
    file: str
    langs: list[str]
    block: str



def get_all_rst_files(dir):
    files = []
    for root, dirs, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith('.rst'):
                files.append(os.path.join(root, filename))

    return files

def is_codeblock(line: str):
    return line.startswith(".. tab-set-code::") or line.startswith(".. tab-set::")

def get_blocks_from_rst_file(file: str):
    lang_regex = re.compile("(java|python|cpp)")
    blocks = []
    with(open(file, 'r', encoding='utf8')) as f:
        block_text = ''
        found_block = False
        block_start = None
        langs = []
        for index, line in enumerate(f):
            if is_codeblock(line):
                found_block = True
                block_text += line
                block_start = index + 1
            elif found_block:
                if line.startswith(' ') or line.startswith('\t'):
                    lang = re.search("(`{3}|:language: )(java|python|cpp|c\\+\\+)", line)
                    if(lang is not None):
                        langs.append(lang.group(2))
                    block_text += line
                else:
                    if langs != []:        
                        blocks.append(
                            CodeBlock(
                                block=block_text,
                                start=block_start,
                                file=file,
                                langs=langs
                                )
                            )

                    block_text = ''
                    block_start = None
                    found_block = False
                    langs = []
    return blocks

def main():
    # dir = sys.argv[1]
    dir = "source"
    files = get_all_rst_files(dir=dir)
    blocks = []
    for file in files:
        file_blocks = get_blocks_from_rst_file(file)
        if len(file_blocks) == 0: 
            continue
        else: 
            blocks.extend(file_blocks)
    with(open("output.txt", 'w')) as f:
                for block in blocks:
                    f.write(f"Block: {block}\n")

if __name__ == '__main__':
    main()