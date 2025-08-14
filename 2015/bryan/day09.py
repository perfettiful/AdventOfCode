# Time: O(n!)
# Space: O(n^2)

from itertools import permutations

def get_distances(fname):
    distances = {}
    with open(fname, 'r') as f:
        for line in f:
            src, _, dst, _, dist = line.strip().split()        
            distances[(src, dst)] = float(dist)
            distances[(dst, src)] = float(dist)
    return distances

def get_shortest_and_longest_distance(fname):
    distances = get_distances(fname)
    places = set()
    for src, dst in distances:
        places.add(src)
        places.add(dst)

    shortest_dist = float('inf')
    longest_dist = -float('inf')
    for perm in permutations(places):
        if perm[0] < perm[-1]: # avoid repeating reverse path (ABC vs CBA)
            total_dist = 0
            for i in range(1,len(perm)):
                total_dist += distances[(perm[i-1], perm[i])]
            if total_dist < shortest_dist:
                shortest_dist = total_dist
                shortest_path = perm
            if total_dist > longest_dist:
                longest_dist = total_dist
                longest_path = perm
    return shortest_path, shortest_dist, longest_dist, longest_path

puzzle_input = './Inputs/day09.txt'
# print(get_distances(puzzle_input))
shortest_path, shortest_dist, longest_dist, longest_path = get_shortest_and_longest_distance(puzzle_input)
print('Shortest:', ' -> '.join(shortest_path), ':', shortest_dist)
print('Longest:', ' -> '.join(longest_path), ':', longest_dist)