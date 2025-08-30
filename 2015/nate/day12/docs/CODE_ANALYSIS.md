# Day 12 Code Analysis

## C Source File: `src/day12.c`

### Header Includes (Lines 1-4)
```c
#include <stdio.h>   // Standard I/O functions (printf, fprintf, fopen, etc.)
#include <stdlib.h>  // Standard library functions (malloc, free, exit)
#include <string.h>  // String manipulation functions (strcmp, strlen)
#include <ctype.h>   // Character type functions (isspace, isdigit)
```

### Utility Functions

#### `skip_whitespace` (Lines 6-10)
```c
void skip_whitespace(const char **json) {
    while (**json && isspace(**json)) {  // While not end of string AND current char is whitespace
        (*json)++;                       // Advance pointer to next character
    }
}
```
- **Purpose**: Advances the JSON pointer past any whitespace characters
- **Parameters**: `const char **json` - Pointer to pointer to JSON string (allows modification)
- **Logic**: Uses `isspace()` to check for spaces, tabs, newlines, etc.
- **Why pointer to pointer**: Allows the function to modify the caller's pointer position

#### `parse_number` (Lines 12-28)
```c
long parse_number(const char **json) {
    long value = 0;        // Initialize result to 0
    int sign = 1;          // Initialize sign to positive (1)
    
    // Handle negative numbers
    if (**json == '-') {   // If current character is minus sign
        sign = -1;         // Set sign to negative (-1)
        (*json)++;         // Advance past the minus sign
    }
    
    // Parse digits
    while (**json && isdigit(**json)) {  // While not end AND current char is a digit
        value = value * 10 + (**json - '0');  // Convert char to int: '5' - '0' = 5
        (*json)++;         // Advance to next character
    }
    
    return sign * value;   // Return signed value
}
```
- **Purpose**: Parses integer numbers (positive or negative) from JSON
- **Algorithm**: 
  1. Check for negative sign and set sign flag
  2. Convert each digit character to integer using ASCII math
  3. Build number by multiplying by 10 and adding each digit
- **Return**: `long` to handle large numbers

#### `is_color_string` (Lines 30-54)
```c
int is_color_string(const char **json, const char *color) {
    int color_len = strlen(color);  // Get length of target color string
    int i = 0;                      // Index for comparing characters
    
    // Skip opening quote
    if (**json == '"') {            // If current char is opening quote
        (*json)++;                  // Advance past it
    }
    
    // Check if it matches the color
    while (color[i] && **json && **json == color[i]) {  // While both strings have chars AND they match
        i++;                        // Advance color string index
        (*json)++;                  // Advance JSON pointer
    }
    
    // Check if we found the color and it's followed by a closing quote
    if (i == color_len && **json == '"') {  // If we matched all chars AND next char is closing quote
        (*json)++;                  // Skip closing quote
        return 1;                   // Return true (color found)
    }
    
    // If not the color, skip to closing quote
    while (**json && **json != '"') {  // Skip all characters until closing quote
        (*json)++;
    }
    if (**json == '"') {            // If we found closing quote
        (*json)++;                  // Skip it
    }
    
    return 0;                       // Return false (color not found)
}
```
- **Purpose**: Checks if a JSON string equals a specified color (e.g., "red")
- **Algorithm**:
  1. Skip opening quote
  2. Compare character by character with target color
  3. If match found and followed by closing quote → return true
  4. If no match → skip to closing quote and return false
- **Why this approach**: Efficiently handles string comparison without allocating memory

#### `parse_json_sum` (Lines 56-134)
```c
long parse_json_sum(const char **json, const char *omit_color) {
    long sum = 0;                   // Initialize sum to 0
    
    skip_whitespace(json);          // Skip any leading whitespace
    
    if (**json == '[') {            // If current char is '[' (array)
        // Parse array
        (*json)++;                  // Skip opening bracket
        skip_whitespace(json);      // Skip whitespace after bracket
        
        while (**json && **json != ']') {  // While not end AND not closing bracket
            sum += parse_json_sum(json, omit_color);  // Recursively parse each element
            skip_whitespace(json);  // Skip whitespace after element
            
            if (**json == ',') {    // If next char is comma
                (*json)++;          // Skip comma
                skip_whitespace(json);  // Skip whitespace after comma
            }
        }
        
        if (**json == ']') {        // If we found closing bracket
            (*json)++;              // Skip it
        }
    }
    else if (**json == '{') {       // If current char is '{' (object)
        // Parse object - check for omit_color values if specified
        (*json)++;                  // Skip opening brace
        skip_whitespace(json);      // Skip whitespace after brace
        
        int has_omit_color = 0;     // Flag to track if object contains omit_color
        long object_sum = 0;        // Sum of values within this object
        
        while (**json && **json != '}') {  // While not end AND not closing brace
            // Skip key (string)
            if (**json == '"') {    // If current char is quote (start of key)
                (*json)++;          // Skip opening quote
                while (**json && **json != '"') {  // Skip all chars until closing quote
                    (*json)++;
                }
                if (**json == '"') {  // If we found closing quote
                    (*json)++;      // Skip it
                }
            }
            
            skip_whitespace(json);  // Skip whitespace after key
            
            if (**json == ':') {    // If next char is colon
                (*json)++;          // Skip colon
                skip_whitespace(json);  // Skip whitespace after colon
                
                // Check if the value is the omit_color
                if (**json == '"' && omit_color) {  // If value is string AND we have omit_color
                    if (is_color_string(json, omit_color)) {  // Check if it matches omit_color
                        has_omit_color = 1;  // Mark that this object contains omit_color
                    }
                } else {
                    // Parse the value normally
                    object_sum += parse_json_sum(json, omit_color);  // Recursively parse value
                }
            }
            
            skip_whitespace(json);  // Skip whitespace after value
            
            if (**json == ',') {    // If next char is comma
                (*json)++;          // Skip comma
                skip_whitespace(json);  // Skip whitespace after comma
            }
        }
        
        if (**json == '}') {        // If we found closing brace
            (*json)++;              // Skip it
        }
        
        // Only add the object's sum if it doesn't contain the omit_color
        if (!has_omit_color) {      // If object doesn't contain omit_color
            sum += object_sum;      // Add object's sum to total
        }
    }
    else if (isdigit(**json) || **json == '-') {  // If current char is digit or minus sign
        // Parse number
        sum = parse_number(json);   // Parse the number and return it
    }
    else if (**json == '"') {       // If current char is quote (string)
        // Skip string
        (*json)++;                  // Skip opening quote
        while (**json && **json != '"') {  // Skip all chars until closing quote
            (*json)++;
        }
        if (**json == '"') {        // If we found closing quote
            (*json)++;              // Skip it
        }
    }
    
    return sum;                     // Return the calculated sum
}
```
- **Purpose**: Main recursive function that parses JSON and sums all numbers
- **Algorithm**:
  1. **Arrays**: Recursively process each element, sum results
  2. **Objects**: Skip keys, process values, check for omit_color
  3. **Numbers**: Parse and return value
  4. **Strings**: Skip entirely
- **Key insight**: Uses recursion to handle nested structures naturally

#### `read_file` (Lines 136-158)
```c
char* read_file(const char* filename) {
    FILE* file = fopen(filename, "r");  // Open file for reading
    if (!file) {                        // If file open failed
        fprintf(stderr, "Error opening file: %s\n", filename);  // Print error
        return NULL;                    // Return NULL to indicate failure
    }
    
    // Get file size
    fseek(file, 0, SEEK_END);          // Move to end of file
    long file_size = ftell(file);      // Get current position (file size)
    fseek(file, 0, SEEK_SET);          // Move back to beginning
    
    // Allocate memory and read file
    char* content = malloc(file_size + 1);  // Allocate space for file + null terminator
    if (!content) {                    // If allocation failed
        fclose(file);                  // Close file
        return NULL;                   // Return NULL
    }
    
    size_t bytes_read = fread(content, 1, file_size, file);  // Read file into memory
    content[bytes_read] = '\0';        // Add null terminator
    fclose(file);                      // Close file
    return content;                    // Return pointer to file content
}
```
- **Purpose**: Reads entire file into memory as a string
- **Algorithm**:
  1. Open file and check for errors
  2. Get file size using `fseek` and `ftell`
  3. Allocate memory for file content + null terminator
  4. Read entire file into memory
  5. Add null terminator and return pointer

#### Test Functions

##### `test_examples` (Lines 160-182)
```c
void test_examples(const char *omit_color) {
    printf("=== Testing JSON Sum Examples ===\n");
    
    const char* examples[] = {        // Array of test JSON strings
        "[1,2,3]",
        "{\"a\":2,\"b\":4}",
        "[[[3]]]",
        "{\"a\":{\"b\":4},\"c\":-1}",
        "{\"a\":[-1,1]}",
        "[-1,{\"a\":1}]",
        "[]",
        "{}"
    };
    
    int expected[] = {6, 6, 3, 3, 0, 0, 0, 0};  // Expected results for each test
    
    for (int i = 0; i < 8; i++) {     // Loop through all test cases
        const char* json = examples[i];  // Get current test JSON
        long sum = parse_json_sum(&json, omit_color);  // Parse and sum
        printf("Example %d: %s -> sum = %ld (expected: %d) %s\n", 
               i + 1, examples[i], sum, expected[i], 
               sum == expected[i] ? "✅" : "❌");  // Print result with checkmark/cross
    }
    printf("\n");
}
```

##### `test_examples_part2` (Lines 184-202)
```c
void test_examples_part2(const char *omit_color) {
    printf("=== Testing JSON Sum Examples (Part 2) ===\n");
    
    const char* examples[] = {        // Part 2 specific test cases
        "[1,2,3]",
        "[1,{\"c\":\"red\",\"b\":2},3]",
        "{\"d\":\"red\",\"e\":[1,2,3,4],\"f\":5}",
        "[1,\"red\",5]"
    };
    
    int expected[] = {6, 4, 0, 6};   // Expected results for Part 2
    
    for (int i = 0; i < 4; i++) {     // Loop through Part 2 tests
        const char* json = examples[i];
        long sum = parse_json_sum(&json, omit_color);
        printf("Example %d: %s -> sum = %ld (expected: %d) %s\n", 
               i + 1, examples[i], sum, expected[i], 
               sum == expected[i] ? "✅" : "❌");
    }
    printf("\n");
}
```

#### `print_usage` (Lines 204-220)
```c
void print_usage(const char *program_name) {
    printf("Usage: %s [OPTIONS]\n", program_name);  // Print usage header
    printf("Options:\n");                           // List available options
    printf("  -h, --help           Show this help message\n");
    printf("  -p, --part1          Run Part 1 (sum all numbers, default)\n");
    printf("  -r, --red            Run Part 2 (ignore objects with 'red')\n");
    printf("  -c, --color COLOR    Ignore objects with specified color\n");
    printf("  -t, --test           Run test examples\n");
    printf("  -f, --file FILE      Input file (default: input.txt)\n");
    printf("\n");
    printf("Examples:\n");                          // Show usage examples
    printf("  %s                    # Part 1 with default input\n", program_name);
    printf("  %s -r                 # Part 2 (ignore 'red')\n", program_name);
    printf("  %s -c blue            # Ignore objects with 'blue'\n", program_name);
    printf("  %s -t                 # Run test examples\n", program_name);
    printf("  %s -f data.json -r    # Part 2 with custom file\n", program_name);
}
```

#### `main` Function (Lines 222-341)
```c
int main(int argc, char *argv[]) {
    const char *omit_color = NULL;    // Initialize omit_color to NULL (no color to omit)
    const char *input_file = "input.txt";  // Default input file
    int run_tests = 0;                // Flag to run tests
    
    // Parse command line arguments
    for (int i = 1; i < argc; i++) {  // Loop through all arguments (skip argv[0] which is program name)
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            print_usage(argv[0]);     // Show help and exit
            return 0;
        }
        else if (strcmp(argv[i], "-p") == 0 || strcmp(argv[i], "--part1") == 0) {
            omit_color = NULL;        // Set to NULL (no color to omit)
        }
        else if (strcmp(argv[i], "-r") == 0 || strcmp(argv[i], "--red") == 0) {
            omit_color = "red";       // Set to "red" (ignore red objects)
        }
        else if (strcmp(argv[i], "-c") == 0 || strcmp(argv[i], "--color") == 0) {
            if (i + 1 < argc) {       // Check if next argument exists
                omit_color = argv[++i];  // Use next argument as color, advance i
            } else {
                fprintf(stderr, "Error: --color requires a color name\n");
                return 1;             // Exit with error
            }
        }
        else if (strcmp(argv[i], "-t") == 0 || strcmp(argv[i], "--test") == 0) {
            run_tests = 1;            // Set flag to run tests
        }
        else if (strcmp(argv[i], "-f") == 0 || strcmp(argv[i], "--file") == 0) {
            if (i + 1 < argc) {       // Check if next argument exists
                input_file = argv[++i];  // Use next argument as filename, advance i
            } else {
                fprintf(stderr, "Error: --file requires a filename\n");
                return 1;             // Exit with error
            }
        }
        else {
            fprintf(stderr, "Unknown option: %s\n", argv[i]);  // Unknown argument
            print_usage(argv[0]);
            return 1;                 // Exit with error
        }
    }
    
    printf("=== Day 12: JSAbacusFramework.io ===\n");  // Print header
    if (omit_color) {                 // If we're omitting a color
        printf("Mode: Ignoring objects with color '%s'\n", omit_color);
    } else {                          // If not omitting any color
        printf("Mode: Summing all numbers\n");
    }
    printf("\n");
    
    if (run_tests) {                  // If test flag was set
        // Run Part 1 tests
        test_examples(NULL);          // Run tests with no color omitted
        
        // Run Part 2 tests if omitting a color
        if (omit_color) {             // If we're omitting a color
            test_examples_part2(omit_color);  // Run Part 2 specific tests
        }
    }
    
    // Read input file
    char* json_content = read_file(input_file);  // Read file into memory
    if (!json_content) {              // If file read failed
        printf("Failed to read input file: %s\n", input_file);
        return 1;                     // Exit with error
    }
    
    // Parse and sum
    const char* json_ptr = json_content;  // Create pointer to start of JSON content
    long total_sum = parse_json_sum(&json_ptr, omit_color);  // Parse and calculate sum
    
    printf("=== Solution ===\n");     // Print solution header
    if (omit_color) {                 // If we omitted a color
        printf("Total sum of all numbers (ignoring objects with '%s'): %ld\n", omit_color, total_sum);
    } else {                          // If no color omitted
        printf("Total sum of all numbers: %ld\n", total_sum);
    }
    
    // Clean up
    free(json_content);               // Free allocated memory
    return 0;                         // Exit successfully
}
```

## Makefile Analysis

### Directory Structure Variables (Lines 1-6)
```makefile
# Directory structure
SRC_DIR = src          # Source files directory
DATA_DIR = data        # Input data files directory
BIN_DIR = bin          # Compiled binaries directory
BUILD_DIR = build      # Build artifacts directory
DOCS_DIR = docs        # Documentation directory
```

### Compiler Settings (Lines 8-12)
```makefile
# Compiler settings
CC = gcc               # Use gcc compiler
CFLAGS = -Wall -Wextra -std=c99 -O2  # Compiler flags:
                                    # -Wall: Enable all warnings
                                    # -Wextra: Enable extra warnings
                                    # -std=c99: Use C99 standard
                                    # -O2: Optimize for speed
TARGET = day12         # Name of the executable
SOURCE = $(SRC_DIR)/day12_combined.c  # Path to source file
```

### Directory Creation (Lines 14-15)
```makefile
# Ensure directories exist
$(shell mkdir -p $(BIN_DIR) $(BUILD_DIR))  # Create bin/ and build/ directories if they don't exist
```

### Default Target (Lines 17-18)
```makefile
# Default target
all: $(BIN_DIR)/$(TARGET)  # When you run 'make' without arguments, build the target
```

### Build Rule (Lines 20-22)
```makefile
# Build the program
$(BIN_DIR)/$(TARGET): $(SOURCE)     # Target depends on source file
	$(CC) $(CFLAGS) -o $(BIN_DIR)/$(TARGET) $(SOURCE)  # Compile command
```

### Run Targets (Lines 24-32)
```makefile
# Run the programs
run: $(BIN_DIR)/$(TARGET)           # Run target depends on built program
	$(BIN_DIR)/$(TARGET) -f $(DATA_DIR)/input.txt  # Run with default input file

run-part1: $(BIN_DIR)/$(TARGET)     # Run Part 1 specifically
	$(BIN_DIR)/$(TARGET) -p -f $(DATA_DIR)/input.txt  # Run with -p flag

run-part2: $(BIN_DIR)/$(TARGET)     # Run Part 2 specifically
	$(BIN_DIR)/$(TARGET) -r -f $(DATA_DIR)/input.txt  # Run with -r flag
```

### Test Targets (Lines 34-42)
```makefile
# Test with examples only
test: $(BIN_DIR)/$(TARGET)          # Run all tests
	$(BIN_DIR)/$(TARGET) -t

test-part1: $(BIN_DIR)/$(TARGET)    # Run Part 1 tests only
	$(BIN_DIR)/$(TARGET) -p -t

test-part2: $(BIN_DIR)/$(TARGET)    # Run Part 2 tests only
	$(BIN_DIR)/$(TARGET) -r -t
```

### Help Target (Lines 44-46)
```makefile
# Show help
help: $(BIN_DIR)/$(TARGET)          # Show program help
	$(BIN_DIR)/$(TARGET) --help
```

### Clean Target (Lines 48-51)
```makefile
# Clean up
clean:                              # Remove all build artifacts
	rm -rf $(BIN_DIR)/* $(BUILD_DIR)/*  # Remove all files in bin/ and build/
```

### Utility Targets (Lines 53-62)
```makefile
# Install dependencies (if any)
install:                            # Placeholder for dependency installation
	@echo "No external dependencies required"

# Development targets
dev: clean all test                 # Clean, build, and test in one command

# Show directory structure
tree:                               # Display project structure
	@echo "Directory structure:"
	@echo "├── src/          # Source files"
	@echo "├── data/         # Input data files"
	@echo "├── bin/          # Compiled binaries"
	@echo "├── build/        # Build artifacts"
	@echo "├── docs/         # Documentation"
	@echo "└── Makefile     # Build configuration"
```

### Phony Declarations (Lines 64-65)
```makefile
# Help
.PHONY: all run run-part1 run-part2 test test-part1 test-part2 help clean install dev tree
```
- **Purpose**: Declares that these targets don't create files with the same name
- **Why needed**: Make normally looks for files named after targets, but these are just actions

## Key Design Patterns

### 1. **Recursive Parsing**
- Natural fit for nested JSON structures
- Each function handles one JSON type and delegates to others
- Stack space proportional to nesting depth

### 2. **Pointer Manipulation**
- `const char **json` allows functions to advance the parser position
- Efficient string traversal without copying
- Caller's pointer is updated automatically

### 3. **Command-Line Interface**
- Flexible argument parsing with multiple options
- Clear help system with examples
- Support for custom input files and colors

### 4. **Memory Management**
- Single allocation for entire file
- Proper cleanup with `free()`
- Error handling for allocation failures

### 5. **Testing Framework**
- Built-in test cases for both parts
- Visual feedback with checkmarks/crosses
- Separate test functions for different scenarios

### 6. **Build System**
- Organized directory structure
- Dependency management
- Multiple targets for different use cases
- Clean separation of source, data, and binaries

This implementation demonstrates professional C development practices with clean code organization, comprehensive testing, and user-friendly interfaces.
