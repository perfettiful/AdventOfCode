# Time: O(N)
# Space: O(N)

with open('Inputs/day03.txt', 'r') as f:
    moves = f.read()

move_map = {"^": (0,1),
            ">": (1,0),
            "<": (-1,0),
            "v": (0,-1)}

def update_coordinate(curr, offset):
    return (curr[0] + offset[0], curr[1] + offset[1])

def part1():
    seen = set()
    curr = (0,0)
    seen.add(curr)

    for move in moves:
        if move not in move_map:
            continue
        offset = move_map[move]
        curr = update_coordinate(curr, offset)
        seen.add(curr)
    return len(seen)

def part2():
    seen = set()
    curr1 = (0,0)
    curr2 = (0,0)
    seen.add(curr1)

    for move1, move2 in zip(moves[::2], moves[1::2]):
        if move1 not in move_map or move2 not in move_map:
            continue
        offset1 = move_map[move1]
        offset2 = move_map[move2]
        curr1 = update_coordinate(curr1, offset1)
        curr2 = update_coordinate(curr2, offset2)
        seen.add(curr1)
        seen.add(curr2)
    return len(seen)

print(part1())
print(part2())