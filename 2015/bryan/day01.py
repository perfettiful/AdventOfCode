# Time: O(N)
# Space: O(1)

with open('Inputs/day01.txt', 'r') as f:
    instructions = f.read()

change_map = {'(': 1, ')': -1}
floor = 0
position = None
for i, ch in enumerate(instructions):
    if ch not in change_map:
        continue
    floor += change_map[ch]
    if position is None and floor < 0:
        position = i+1

print(floor)

print(position)