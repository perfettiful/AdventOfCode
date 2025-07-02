# Time: O(N)
# Space: O(1)


def check_invalid(s):
    for i in range(len(s)-1):
        if s[i:i+2] in ['ab', 'cd', 'pq', 'xy']:
            # print(f"string {s} is invalid")
            return True
    return False

def check_twice(s):
    for i in range(len(s)-1):
        if s[i] == s[i+1]:
            # print(f"string {s} has two letters in a row")
            return True
    return False

def count_vowels(s):
    vowel_count = 0
    for ch in s:
        if ch in 'aeiou':
            vowel_count += 1
    # print(f"string {s} has {vowel_count} vowels")
    return vowel_count

def is_nice(s):
    if (count_vowels(s) >= 3) and check_twice(s) and not check_invalid(s):
        return True
    else:
        return False

def count_nice(fpath):
    num_nice = 0
    num_naughty = 0
    with open(fpath, 'r') as f:
        for line in f:
            if is_nice(line):
                num_nice += 1
            else:
                num_naughty += 1
    return num_nice

assert is_nice('ugknbfddgicrmopn')
assert is_nice('aaa')
assert not is_nice('jchzalrnumimnmhp')
assert not is_nice('haegwjzuvuyypxyu')
assert not is_nice('dvszwmarrgswjxmb')

print(count_nice('Inputs/day05.txt'))

def has_twice_without_overlaps(s):
    pairs_to_positions = {}
    for i in range(len(s)-1):
        pair = s[i:i+2]
        if pair in pairs_to_positions:
            if i in pairs_to_positions[pair]:
                continue
            return True
        pairs_to_positions[pair] = set([i, i+1])
    return False

def has_repeat_with_middle(s):
    for i in range(len(s)-2):
        if s[i] == s[i+2]:
            return True
    return False

def is_nice2(s):
    if has_repeat_with_middle(s) and has_twice_without_overlaps(s):
        return True
    else:
        return False

def count_nice2(fpath):
    num_nice = 0
    with open(fpath, 'r') as f:
        for line in f:
            if is_nice2(line):
                num_nice += 1

    return num_nice

assert is_nice2('qjhvhtzxzqqjkmpb')
assert is_nice2('xxyxx')
assert not is_nice2('uurcxstgmygtbstg')
assert not is_nice2('ieodomkazucvgmuy')

print(count_nice2('Inputs/day05.txt'))