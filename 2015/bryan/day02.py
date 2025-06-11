# Time: O(n)
# Space: O(1)

'''
1. for each line in input
2. extract each number separated by "x"
3. compute l*w, l*h, w*h
3. find min of three
4. total needed for box: 2*l*w + 2*l*h + 2*w*h + slackside
5. Sum over all boxes
'''

def find_area_of_box(s):
    l, w, h = s.split('x')
    l, w, h = int(l), int(w), int(h)
    slack = min(l*w, l*h, h*w)
    return 2*l*w + 2*l*h + 2*w*h + slack


def compute_total_paper_needed(fname):
    with open(fname, 'r') as f:
        total_area = 0
        for line in f:
            area = find_area_of_box(line)
            total_area += area
    return total_area

assert find_area_of_box('2x3x4') == 58
assert find_area_of_box('1x1x10') == 43

print(compute_total_paper_needed('Inputs/day02.txt'))

def find_length_of_ribbon(s):
    vals = s.split('x')
    clean_vals = []
    if len(vals) != 3:
        print(vals)
        for v in vals:
            if not v.strip().isnumeric():
                continue
            clean_vals.append(v)
    else:
        clean_vals = vals
    l, w, h = clean_vals
    # l, w, h = s.split('x')
    l, w, h = int(l), int(w), int(h)
    smallest_perimeter = min(2*l+2*w, 2*l+2*h, 2*h+2*w)
    return smallest_perimeter + l*w*h

def compute_total_ribbon_needed(fname):
    with open(fname, 'r') as f:
        total_length = 0
        for line in f:
            length = find_length_of_ribbon(line)
            total_length += length
    return total_length

assert find_length_of_ribbon('2x3x4') == 34
assert find_length_of_ribbon('1x1x10') == 14

print(f"Total Ribbon: {compute_total_ribbon_needed('Inputs/day02.txt')}")