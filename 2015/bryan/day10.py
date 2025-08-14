# Time: O(N)
# Space: O(N)

from collections import deque

def iterate(digits: str) -> str:
    result = []
    current = digits[0]
    count = 1
    idx = 1

    while idx < len(digits):
        val = digits[idx]
        if val == current:
            count += 1
        else:
            result.append(str(count) + str(current))
            current = val
            count = 1
        idx += 1

    result.append(str(count) + str(current))

    return ''.join(result)

def look_and_say(digits: str, num_iter: int) -> int:

    for _ in range(num_iter):
        digits = iterate(digits)

    return len(digits)

puzze_input = '1113222113'

assert iterate('1') == '11'
assert iterate('11') == '21'
assert iterate('21') == '1211'
assert iterate('1211') == '111221'
assert iterate('111221') == '312211'

print('part1:', look_and_say(puzze_input, num_iter=40))
print('part2:', look_and_say(puzze_input, num_iter=50))