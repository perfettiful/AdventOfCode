# Time: O(N)
# Space: O(N)

def build_circuit(fpath):
    circuit = {}
    # circuit[node] = ([parent_nodes], operation)

    with open(fpath, 'r') as f:
        for line in f:
            instructions = line.split()
            node = instructions[-1]
            recipe = instructions[:-2]

            # single input
            if len(recipe) == 1:
                parent = [int(val) if val.isnumeric() else val for val in recipe]
                operation = None

            # NOT
            elif len(recipe) == 2:
                parent = recipe[-1:]
                operation = recipe[0]

            # RSHIFT, LSHIFT, AND, OR
            elif len(recipe) == 3:
                p1 = int(recipe[0]) if recipe[0].isnumeric() else recipe[0]
                p2 = int(recipe[2]) if recipe[2].isnumeric() else recipe[2]
                parent = [p1, p2]
                operation = recipe[1]

            circuit[node] = (parent, operation)
    return circuit

circuit = build_circuit('Inputs/day07.txt')
seen = {}

def traverse_circuit(circuit, starting_node):
    print(f"traversing node {starting_node}")
    if starting_node in seen:
        return seen[starting_node]
    
    if starting_node not in circuit:
        if isinstance(starting_node, int):
            return starting_node
        else:
            return -1
    
    parent, operation = circuit[starting_node]
    print(f"\t Node {starting_node} depends on nodes {parent}")

    if operation is None:
        result = traverse_circuit(circuit, parent[0])
    
    elif operation == 'RSHIFT':
        result = traverse_circuit(circuit, parent[0]) >> parent[1]
    
    elif operation == 'LSHIFT':
        result = traverse_circuit(circuit, parent[0]) << parent[1]
    
    elif operation == 'AND':
        result = traverse_circuit(circuit, parent[0]) & traverse_circuit(circuit, parent[1])
    
    elif operation == 'OR':
        result = traverse_circuit(circuit, parent[0]) | traverse_circuit(circuit, parent[1])
    
    elif operation == 'NOT':
        result = ~traverse_circuit(circuit, parent[0])
    
    seen[starting_node] = result
    return result
    
a1 = traverse_circuit(circuit, 'a')
print(a1)

circuit['b'] = ([a1], None)
seen = {}

a2 = traverse_circuit(circuit, 'a')
print(a2)
