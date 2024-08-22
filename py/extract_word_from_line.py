import re

def extract_word_from_line(line):
    # 正则表达式匹配中间的英文单词
    match = re.search(r'\d+\.\s+([a-zA-Z]+)\s', line)
    if match:
        return match.group(1)
    return None

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            word = extract_word_from_line(line)
            if word:
                outfile.write(word + '\n')

input_file_path = './input.txt'
output_file_path = './output.txt'
process_file(input_file_path, output_file_path)
