import sys, os
from dataclasses import dataclass

@dataclass
class CodeBlock:
    block: str
    start: int
    file: str


def get_all_rst_files(dir):
    files = []
    for root, dirs, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith('.rst'):
                files.append(os.path.join(root, filename))

    return files

def get_blocks_from_rst_file(file):
    blocks = []
    with(open(file, 'r')) as f:
        block_text = ''
        found_block = False
        block_start = None
        for linenum, line in enumerate(f):
            if line.startswith(".. tab-set-code::"):
                found_block = True
                block_text += line
                block_start = linenum
            elif found_block:
                if line.startswith(' ') or line.startswith('\t'):
                    block_text += line
                else:
                    blocks.append(CodeBlock(block=block_text, start=block_start, file=file))
                    block_text = ''
                    block_start = None
                    found_block = False
    return blocks

def main():
    dir = sys.argv[1]
    files = get_all_rst_files(dir=dir)
    for file in files:
        blocks = get_blocks_from_rst_file(file)
        if len(blocks) == 0: continue
        else: 
            with(open("output.txt", 'w')) as f:
                for block in blocks:
                    f.write(f"File: {block.file}\n")
                    f.write(f"Block: {block.block}\n")
                    f.write(f"Start: {block.start}\n")
                    f.write("\n")
                break

if __name__ == '__main__':
    main()