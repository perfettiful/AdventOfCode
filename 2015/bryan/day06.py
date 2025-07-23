# Time: O(n)
# Space: O(1)

def count_on(grid):
    count = 0
    for row in grid:
        for val in row:
            if val == 1:
                count += 1
    return count

def update_grid(grid, command, c1, c2):
    x0 = c1[0]
    x1 = c2[0]
    y0 = c1[1]
    y1 = c2[1]
    for row in range(y0, y1+1):
        for col in range(x0, x1+1):
            if command == 'toggle':
                grid[row][col] = 1-grid[row][col]
            if command == 'turn on':
                grid[row][col] = 1
            if command == 'turn off':
                grid[row][col] = 0                 
    return 

def parse_line(line):
    if line.startswith('toggle'):
        command = 'toggle'
    elif line.startswith('turn on'):
        command = 'turn on'
    elif line.startswith('turn off'):
        command = 'turn off'

    line = line.strip()
    first_pair, second_pair = line.split(' ')[-3:][0], line.split(' ')[-3:][-1]
    return command, tuple([int(val) for val in first_pair.split(',')]), \
        tuple([int(val) for val in second_pair.split(',')])

def count_lights(fpath):
    grid = [[0 for _ in range(1000)] for _ in range(1000)]
    with open(fpath, 'r') as f:
        for line in f:
            command, c1, c2 = parse_line(line)
            update_grid(grid, command, c1, c2)
    light_count = count_on(grid)
    return light_count

fpath = './Inputs/day06.txt'
print(count_lights(fpath))

def count_brightness(grid):
    brightness = 0
    for row in grid:
        for val in row:
            brightness += val
    return brightness

def update_grid2(grid, command, c1, c2):
    x0 = c1[0]
    x1 = c2[0]
    y0 = c1[1]
    y1 = c2[1]
    for row in range(y0, y1+1):
        for col in range(x0, x1+1):
            if command == 'toggle':
                grid[row][col] += 2
            if command == 'turn on':
                grid[row][col] += 1
            if command == 'turn off':
                grid[row][col] = max(0, grid[row][col]-1)                 
    return 

def count_lights2(fpath):
    grid = [[0 for _ in range(1000)] for _ in range(1000)]
    with open(fpath, 'r') as f:
        for line in f:
            command, c1, c2 = parse_line(line)
            update_grid2(grid, command, c1, c2)
    light_count = count_brightness(grid)
    return light_count

print(count_lights2(fpath))