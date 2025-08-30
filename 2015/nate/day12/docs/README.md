# Day 12: JSAbacusFramework.io

## Problem Description

### **Part 1**
Parse a JSON document and find the sum of all numbers throughout the document. The JSON can contain:
- Arrays: `[1,2,3]`
- Objects: `{"a":2,"b":4}`
- Numbers: positive, negative, or zero
- Strings: (which should be ignored)

### **Part 2**
Same as Part 1, but ignore any object (and all of its children) which has any property with the value "red". Do this only for objects (`{...}`), not arrays (`[...]`).

## Solution Overview

### **Algorithm**
The solution uses a **recursive JSON parser** that:
1. **Skips whitespace** between tokens
2. **Handles arrays**: Recursively processes each element
3. **Handles objects**: Skips keys, processes values
4. **Parses numbers**: Handles positive and negative integers
5. **Skips strings**: Ignores string content
6. **Sums all numbers**: Accumulates the total

**Part 2 Enhancement**: When parsing objects, check for "red" values and skip the entire object if found.

### **Key Functions**

#### **`parse_json_sum(const char **json, const char *omit_color)`**
- **Main recursive function** that handles all JSON types
- **Returns**: Sum of all numbers in the current JSON structure
- **Handles**: Arrays, objects, numbers, strings
- **Parameters**: JSON pointer and optional color to omit

#### **`is_color_string(const char **json, const char *color)`**
- **Checks if a string equals the specified color**
- **Efficient string comparison** with proper quote handling
- **Returns**: 1 if color matches, 0 otherwise

#### **`parse_number(const char **json)`**
- **Parses integers** (positive and negative)
- **Handles**: Sign, digits, conversion to long
- **Returns**: Numeric value

#### **`skip_whitespace(const char **json)`**
- **Utility function** to advance past whitespace
- **Uses**: `isspace()` from `<ctype.h>`

### **Time Complexity**
- **O(n)** where n is the length of the JSON string
- **Space**: O(d) where d is the maximum nesting depth (stack space for recursion)

### **Example Walkthrough**

**Part 1 Input**: `{"a":1,"b":[2,3]}`

**Processing**:
1. Start with `{` → parse object
2. Skip `"a"` (string key)
3. Parse `1` → add to sum (sum = 1)
4. Skip `"b"` (string key)  
5. Parse `[2,3]` → recursive call
   - Parse `2` → add to sum (sum = 3)
   - Parse `3` → add to sum (sum = 6)
6. Return total sum = 6

**Part 2 Input**: `[1,{"c":"red","b":2},3]`

**Processing**:
1. Start with `[` → parse array
2. Parse `1` → add to sum (sum = 1)
3. Parse `{"c":"red","b":2}` → detect "red", skip entire object
4. Parse `3` → add to sum (sum = 4)
5. Return total sum = 4

## Directory Structure

```
day12/
├── src/          # Source files
│   └── day12_combined.c
├── data/         # Input data files
│   └── input.txt
├── bin/          # Compiled binaries (generated)
├── build/        # Build artifacts (generated)
├── docs/         # Documentation
│   └── README.md
├── Makefile      # Build configuration
└── .gitignore    # Git ignore rules
```

## Usage

### **Build**
```bash
make
```

### **Run Solutions**

#### **Part 1 (Default)**
```bash
make run
# or
make run-part1
```

#### **Part 2 (Ignore 'red')**
```bash
make run-part2
```

### **Test Examples**
```bash
make test        # Run all tests
make test-part1  # Part 1 tests only
make test-part2  # Part 2 tests only
```

### **Show Help**
```bash
make help
```

### **Development**
```bash
make dev         # Clean, build, and test
make tree        # Show directory structure
make clean       # Remove build artifacts
```

### **Direct Program Usage**

You can also run the program directly with various options:

```bash
# Show help
bin/day12 --help

# Part 1 (default)
bin/day12
bin/day12 -p

# Part 2 (ignore 'red')
bin/day12 -r

# Custom color
bin/day12 -c blue
bin/day12 -c green

# Run tests
bin/day12 -t

# Custom input file
bin/day12 -f custom.json
bin/day12 -f custom.json -r
```

## Test Results

### **Part 1 Examples**
All examples pass:
- `[1,2,3]` → 6 ✅
- `{"a":2,"b":4}` → 6 ✅
- `[[[3]]]` → 3 ✅
- `{"a":{"b":4},"c":-1}` → 3 ✅
- `{"a":[-1,1]}` → 0 ✅
- `[-1,{"a":1}]` → 0 ✅
- `[]` → 0 ✅
- `{}` → 0 ✅

### **Part 2 Examples**
All examples pass:
- `[1,2,3]` → 6 ✅
- `[1,{"c":"red","b":2},3]` → 4 ✅
- `{"d":"red","e":[1,2,3,4],"f":5}` → 0 ✅
- `[1,"red",5]` → 6 ✅

## Solutions

- **Part 1 Answer**: 191164
- **Part 2 Answer**: 87842

## Key Insights

1. **Recursive parsing**: Natural fit for nested JSON structures
2. **Pointer manipulation**: Efficient string traversal with `const char **`
3. **Whitespace handling**: Critical for robust parsing
4. **Type detection**: Use first character to determine JSON type
5. **Memory management**: Simple file reading with dynamic allocation
6. **State tracking**: Part 2 requires tracking object context to detect "red" values
7. **Selective skipping**: Only objects with "red" are ignored, arrays are unaffected
8. **Flexible design**: Single program handles both parts with command-line options

## Best Practices Implemented

- **Separation of concerns**: Source, data, and documentation in separate directories
- **Build system**: Proper Makefile with dependency management
- **Version control**: Appropriate .gitignore for C development
- **Documentation**: Comprehensive README with examples
- **Testing**: Built-in test suite with examples
- **Flexibility**: Command-line options for different use cases
- **Clean structure**: Organized directory layout following C development standards

The solution demonstrates clean, efficient JSON parsing in vanilla C without external libraries, with a professional project structure. 