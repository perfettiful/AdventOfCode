import time
from itertools import groupby

def look_and_say(sequence):
    result = []
    count = 1
    current_digit = sequence[0]
    
    for i in range(1, len(sequence)):
        if sequence[i] == current_digit:
            count += 1
        else:
            result.append(str(count) + current_digit)
            count = 1
            current_digit = sequence[i]
    
    result.append(str(count) + current_digit)
    
    return ''.join(result)

def solve_look_and_say(initial_sequence, iterations):
    current = initial_sequence
    
    for i in range(iterations):
        current = look_and_say(current)
    
    return len(current)

def test_examples():
    """Test with the provided examples."""
    print("=== Testing Look-and-Say Examples ===")
    
    examples = [
        ("1", "11"),
        ("11", "21"),
        ("21", "1211"),
        ("1211", "111221"),
        ("111221", "312211")
    ]
    
    for input_seq, expected in examples:
        result = look_and_say(input_seq)
        passed = result == expected
        print(f"{input_seq} -> {result} (expected: {expected}) {'✅' if passed else '❌'}")

def solve_part1():
    """Solve Part 1 of the problem."""
    initial_sequence = "1113222113"
    iterations = 40
    
    print("\n=== Part 1: Look-and-Say Sequence ===")
    print(f"Initial sequence: {initial_sequence}")
    print(f"Iterations: {iterations}")
    
    start_time = time.perf_counter()
    final_length = solve_look_and_say(initial_sequence, iterations)
    end_time = time.perf_counter()
    
    print(f"Final sequence length: {final_length}")
    print(f"Execution time: {(end_time - start_time) * 1000:.2f}ms")
    
    return final_length

def solve_part2():
    """Solve Part 2 of the problem (50 iterations)."""
    initial_sequence = "1113222113"
    iterations = 50
    
    print("\n=== Part 2: Look-and-Say Sequence (50 iterations) ===")
    print(f"Initial sequence: {initial_sequence}")
    print(f"Iterations: {iterations}")
    
    start_time = time.perf_counter()
    final_length = solve_look_and_say(initial_sequence, iterations)
    end_time = time.perf_counter()
    
    print(f"Final sequence length: {final_length}")
    print(f"Execution time: {(end_time - start_time) * 1000:.2f}ms")
    
    return final_length

def analyze_growth():
    """Analyze how the sequence grows over iterations."""
    print("\n=== Growth Analysis ===")
    initial_sequence = "1113222113"
    
    current = initial_sequence
    for i in range(10):  # Show first 10 iterations
        length = len(current)
        print(f"Iteration {i}: length = {length}")
        current = look_and_say(current)

if __name__ == "__main__":
    test_examples()
    solve_part1()
    solve_part2()
    analyze_growth() 