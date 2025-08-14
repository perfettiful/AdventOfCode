# Time: O(n)
# Space: O(1)

def parse_string(s) -> int:
    idx = 1
    count = 0
    while idx < len(s)-1:
        if s[idx] == '\\':
            if (idx < len(s)-2) and (s[idx+1] == '"' or s[idx+1] == '\\'):
                idx += 1
            elif (idx < len(s)-4) and (s[idx+1] == 'x'):
                idx += 3
        idx += 1
        count += 1
    return count

def find_character_difference(s: str) -> int:
    all_characters = len(s)
    memory_characters = parse_string(s)
    return all_characters - memory_characters

def encode_string(s: str) -> int:
    count = 0
    for ch in s:
        if ch in ['"', '\\']:
            count += 1
        count += 1
    return count + 2

def reencode_string(s: str) -> int:
    original_characters = len(s)
    reencoded_characters = encode_string(s)
    return reencoded_characters - original_characters
    
fname = './Inputs/day08.txt'

def main(fname):
    total_count = 0
    total_count2 = 0
    with open(fname, 'r') as f:
        for line in f:
            total_count += find_character_difference(line.strip())
            total_count2 += reencode_string(line.strip())
    return total_count, total_count2

assert parse_string(r'""') == 0
assert parse_string(r'"abc"') == 3
assert parse_string(r'"aaa\"aaa"') == 7
assert parse_string(r'"\x27"') == 1
# print(parse_string(r'"aaa\"aaa"'))

print(encode_string(r'"\x27"'))
assert encode_string(r'""') == 6
assert encode_string(r'"abc"') == 9
assert encode_string(r'"aaa\"aaa"') == 16
assert encode_string(r'"\x27"') == 11
print(main(fname))
