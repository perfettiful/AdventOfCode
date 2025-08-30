// Include the standard input/output library - gives us printf, fprintf, fopen, fclose, etc.
#include <stdio.h>
// Include the standard library - gives us malloc, free, exit, etc.
#include <stdlib.h>
// Include the string library - gives us strcmp, strlen, etc.
#include <string.h>
// Include the character type library - gives us isspace, isdigit, etc.
#include <ctype.h>

// Function that moves the JSON pointer forward, skipping over spaces, tabs, and newlines
// Takes a pointer to a pointer to const char - this lets us change where the caller's pointer points
void skip_whitespace(const char **json) {
    // Keep going while we haven't reached the end of the string AND the current character is whitespace
    while (**json && isspace(**json)) {
        // Move the pointer forward by one character position
        (*json)++;
    }
}

// Function that reads a number from the JSON string and converts it to a long integer
// Returns a long integer, takes a pointer to a pointer to const char
long parse_number(const char **json) {
    // Start with the number 0
    long value = 0;
    // Start with positive sign (1 means positive, -1 means negative)
    int sign = 1;
    
    // Check if the current character is a minus sign (meaning this is a negative number)
    if (**json == '-') {
        // Change sign to negative (-1)
        sign = -1;
        // Move the pointer past the minus sign to the first digit
        (*json)++;
    }
    
    // Keep going while we haven't reached the end of the string AND the current character is a digit (0-9)
    while (**json && isdigit(**json)) {
        // Convert the character to a number: '5' becomes 5 by subtracting '0' (ASCII value 48)
        // Build the number by multiplying current value by 10 and adding the new digit
        // Example: if we have "123", we do: 0*10+1=1, then 1*10+2=12, then 12*10+3=123
        value = value * 10 + (**json - '0');
        // Move the pointer to the next character
        (*json)++;
    }
    
    // Return the final number with the correct sign (positive or negative)
    return sign * value;
}

// Function that checks if a JSON string equals a specific color (like "red")
// Returns 1 (true) if it matches, 0 (false) if it doesn't
// Takes the JSON pointer and the color string we're looking for
int is_color_string(const char **json, const char *color) {
    // Count how many characters are in the color string we're looking for
    int color_len = strlen(color);
    // Start counting from position 0 in the color string
    int i = 0;
    
    // Check if the current character is a quote (start of a JSON string)
    if (**json == '"') {
        // Move the pointer past the opening quote
        (*json)++;
    }
    
    // Keep going while we have more characters in both the color string AND the JSON string AND they match
    while (color[i] && **json && **json == color[i]) {
        // Move to the next character in the color string
        i++;
        // Move to the next character in the JSON string
        (*json)++;
    }
    
    // Check if we matched all the characters in the color AND the next character is a closing quote
    if (i == color_len && **json == '"') {
        // Move past the closing quote
        (*json)++;
        // Return 1 (true) - we found the color
        return 1;
    }
    
    // If we didn't find the color, skip all characters until we find the closing quote
    while (**json && **json != '"') {
        // Move the pointer forward
        (*json)++;
    }
    // If we found a closing quote
    if (**json == '"') {
        // Move past it
        (*json)++;
    }
    
    // Return 0 (false) - we didn't find the color
    return 0;
}

// Main function that reads JSON and adds up all the numbers it finds
// Returns the total sum as a long integer
// Takes the JSON pointer and an optional color to ignore (for Part 2)
long parse_json_sum(const char **json, const char *omit_color) {
    // Start with a total of 0
    long sum = 0;
    
    // Skip any spaces, tabs, or newlines at the beginning
    skip_whitespace(json);
    
    // Check if the current character is '[' (start of a JSON array)
    if (**json == '[') {
        // Move past the opening bracket '['
        (*json)++;
        // Skip any spaces after the bracket
        skip_whitespace(json);
        
        // Keep going while we haven't reached the end AND we haven't found the closing bracket ']'
        while (**json && **json != ']') {
            // Recursively parse this array element and add its value to our sum
            sum += parse_json_sum(json, omit_color);
            // Skip any spaces after the element
            skip_whitespace(json);
            
            // Check if the next character is a comma (separator between array elements)
            if (**json == ',') {
                // Move past the comma
                (*json)++;
                // Skip any spaces after the comma
                skip_whitespace(json);
            }
        }
        
        // If we found the closing bracket ']'
        if (**json == ']') {
            // Move past it
            (*json)++;
        }
    }
    // Check if the current character is '{' (start of a JSON object)
    else if (**json == '{') {
        // Move past the opening brace '{'
        (*json)++;
        // Skip any spaces after the brace
        skip_whitespace(json);
        
        // Flag to remember if this object contains the color we want to ignore
        int has_omit_color = 0;
        // Sum of all the values inside this object
        long object_sum = 0;
        
        // Keep going while we haven't reached the end AND we haven't found the closing brace '}'
        while (**json && **json != '}') {
            // Check if the current character is a quote (start of a key name)
            if (**json == '"') {
                // Move past the opening quote
                (*json)++;
                // Skip all characters until we find the closing quote
                while (**json && **json != '"') {
                    (*json)++;
                }
                // If we found the closing quote
                if (**json == '"') {
                    // Move past it
                    (*json)++;
                }
            }
            
            // Skip any spaces after the key name
            skip_whitespace(json);
            
            // Check if the next character is a colon ':' (separates key from value)
            if (**json == ':') {
                // Move past the colon
                (*json)++;
                // Skip any spaces after the colon
                skip_whitespace(json);
                
                // Check if the value is a string AND we have a color we want to ignore
                if (**json == '"' && omit_color) {
                    // Check if this string matches the color we want to ignore
                    if (is_color_string(json, omit_color)) {
                        // Remember that this object contains the color we want to ignore
                        has_omit_color = 1;
                    }
                } else {
                    // Parse the value normally (could be a number, array, or object)
                    object_sum += parse_json_sum(json, omit_color);
                }
            }
            
            // Skip any spaces after the value
            skip_whitespace(json);
            
            // Check if the next character is a comma (separator between object properties)
            if (**json == ',') {
                // Move past the comma
                (*json)++;
                // Skip any spaces after the comma
                skip_whitespace(json);
            }
        }
        
        // If we found the closing brace '}'
        if (**json == '}') {
            // Move past it
            (*json)++;
        }
        
        // Only add this object's sum to our total if it doesn't contain the color we want to ignore
        if (!has_omit_color) {
            // Add the object's sum to our total
            sum += object_sum;
        }
    }
    // Check if the current character is a digit (0-9) or a minus sign (start of a number)
    else if (isdigit(**json) || **json == '-') {
        // Parse this number and return its value
        sum = parse_number(json);
    }
    // Check if the current character is a quote (start of a string)
    else if (**json == '"') {
        // Move past the opening quote
        (*json)++;
        // Skip all characters until we find the closing quote
        while (**json && **json != '"') {
            (*json)++;
        }
        // If we found the closing quote
        if (**json == '"') {
            // Move past it
            (*json)++;
        }
    }
    
    // Return the total sum we calculated
    return sum;
}

// Function that reads an entire file into memory as a string
// Returns a pointer to the file content, or NULL if there was an error
// Takes the filename as a string
char* read_file(const char* filename) {
    // Open the file for reading - returns a FILE pointer or NULL if it failed
    FILE* file = fopen(filename, "r");
    // Check if opening the file failed
    if (!file) {
        // Print an error message to the error output
        fprintf(stderr, "Error opening file: %s\n", filename);
        // Return NULL to tell the caller that we failed
        return NULL;
    }
    
    // Move the file pointer to the very end of the file
    fseek(file, 0, SEEK_END);
    // Get the current position (which is the file size in bytes)
    long file_size = ftell(file);
    // Move the file pointer back to the beginning of the file
    fseek(file, 0, SEEK_SET);
    
    // Allocate memory for the file content plus one extra byte for the null terminator
    char* content = malloc(file_size + 1);
    // Check if memory allocation failed
    if (!content) {
        // Close the file
        fclose(file);
        // Return NULL to tell the caller that we failed
        return NULL;
    }
    
    // Read the entire file into our allocated memory
    size_t bytes_read = fread(content, 1, file_size, file);
    // Add a null terminator at the end so it's a proper C string
    content[bytes_read] = '\0';
    // Close the file
    fclose(file);
    // Return a pointer to the file content
    return content;
}

// Function that runs test examples to make sure our code works correctly
// Takes an optional color to ignore (NULL means don't ignore any colors)
// Returns nothing (void)
void test_examples(const char *omit_color) {
    // Print a header for the test section
    printf("=== Testing JSON Sum Examples ===\n");
    
    // Array of test JSON strings to try
    const char* examples[] = {
        "[1,2,3]",
        "{\"a\":2,\"b\":4}",
        "[[[3]]]",
        "{\"a\":{\"b\":4},\"c\":-1}",
        "{\"a\":[-1,1]}",
        "[-1,{\"a\":1}]",
        "[]",
        "{}"
    };
    
    // Array of expected results for each test
    int expected[] = {6, 6, 3, 3, 0, 0, 0, 0};
    
    // Loop through all 8 test cases
    for (int i = 0; i < 8; i++) {
        // Get the current test JSON string
        const char* json = examples[i];
        // Parse the JSON and calculate the sum
        long sum = parse_json_sum(&json, omit_color);
        // Print the result with a checkmark if it's correct, cross if it's wrong
        printf("Example %d: %s -> sum = %ld (expected: %d) %s\n", 
               i + 1, examples[i], sum, expected[i], 
               sum == expected[i] ? "✅" : "❌");
    }
    // Print a blank line
    printf("\n");
}

// Function that runs Part 2 specific test examples
// Takes an optional color to ignore (NULL means don't ignore any colors)
// Returns nothing (void)
void test_examples_part2(const char *omit_color) {
    // Print a header for the Part 2 test section
    printf("=== Testing JSON Sum Examples (Part 2) ===\n");
    
    // Array of Part 2 specific test JSON strings
    const char* examples[] = {
        "[1,2,3]",
        "[1,{\"c\":\"red\",\"b\":2},3]",
        "{\"d\":\"red\",\"e\":[1,2,3,4],\"f\":5}",
        "[1,\"red\",5]"
    };
    
    // Array of expected results for Part 2 tests
    int expected[] = {6, 4, 0, 6};
    
    // Loop through all 4 Part 2 test cases
    for (int i = 0; i < 4; i++) {
        // Get the current test JSON string
        const char* json = examples[i];
        // Parse the JSON and calculate the sum
        long sum = parse_json_sum(&json, omit_color);
        // Print the result with a checkmark if it's correct, cross if it's wrong
        printf("Example %d: %s -> sum = %ld (expected: %d) %s\n", 
               i + 1, examples[i], sum, expected[i], 
               sum == expected[i] ? "✅" : "❌");
    }
    // Print a blank line
    printf("\n");
}

// Function that prints help information about how to use the program
// Takes the program name as a string
// Returns nothing (void)
void print_usage(const char *program_name) {
    // Print the usage header with the program name
    printf("Usage: %s [OPTIONS]\n", program_name);
    // Print the options header
    printf("Options:\n");
    // Print the help option
    printf("  -h, --help           Show this help message\n");
    // Print the Part 1 option
    printf("  -p, --part1          Run Part 1 (sum all numbers, default)\n");
    // Print the Part 2 option
    printf("  -r, --red            Run Part 2 (ignore objects with 'red')\n");
    // Print the custom color option
    printf("  -c, --color COLOR    Ignore objects with specified color\n");
    // Print the test option
    printf("  -t, --test           Run test examples\n");
    // Print the file option
    printf("  -f, --file FILE      Input file (default: input.txt)\n");
    // Print a blank line
    printf("\n");
    // Print the examples header
    printf("Examples:\n");
    // Print an example for Part 1
    printf("  %s                    # Part 1 with default input\n", program_name);
    // Print an example for Part 2
    printf("  %s -r                 # Part 2 (ignore 'red')\n", program_name);
    // Print an example for custom color
    printf("  %s -c blue            # Ignore objects with 'blue'\n", program_name);
    // Print an example for tests
    printf("  %s -t                 # Run test examples\n", program_name);
    // Print an example for custom file
    printf("  %s -f data.json -r    # Part 2 with custom file\n", program_name);
}

// Main function - this is where the program starts when you run it
// Takes the number of command line arguments and an array of argument strings
// Returns 0 for success, 1 for error
int main(int argc, char *argv[]) {
    // Start with no color to ignore (NULL means ignore nothing)
    const char *omit_color = NULL;
    // Start with the default input file name
    const char *input_file = "input.txt";
    // Start with tests turned off (0 means false)
    int run_tests = 0;
    
    // Loop through all command line arguments (start at 1 because argv[0] is the program name)
    for (int i = 1; i < argc; i++) {
        // Check if this argument is the help flag (-h or --help)
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            // Print the help message and exit successfully
            print_usage(argv[0]);
            return 0;
        }
        // Check if this argument is the Part 1 flag (-p or --part1)
        else if (strcmp(argv[i], "-p") == 0 || strcmp(argv[i], "--part1") == 0) {
            // Set omit_color to NULL (don't ignore any colors)
            omit_color = NULL;
        }
        // Check if this argument is the Part 2 flag (-r or --red)
        else if (strcmp(argv[i], "-r") == 0 || strcmp(argv[i], "--red") == 0) {
            // Set omit_color to "red" (ignore objects that contain "red")
            omit_color = "red";
        }
        // Check if this argument is the custom color flag (-c or --color)
        else if (strcmp(argv[i], "-c") == 0 || strcmp(argv[i], "--color") == 0) {
            // Check if there's another argument after this one
            if (i + 1 < argc) {
                // Use the next argument as the color to ignore and skip over it
                omit_color = argv[++i];
            } else {
                // Print an error message because --color needs a color name
                fprintf(stderr, "Error: --color requires a color name\n");
                // Exit with error code 1
                return 1;
            }
        }
        // Check if this argument is the test flag (-t or --test)
        else if (strcmp(argv[i], "-t") == 0 || strcmp(argv[i], "--test") == 0) {
            // Turn on the test flag (1 means true)
            run_tests = 1;
        }
        // Check if this argument is the file flag (-f or --file)
        else if (strcmp(argv[i], "-f") == 0 || strcmp(argv[i], "--file") == 0) {
            // Check if there's another argument after this one
            if (i + 1 < argc) {
                // Use the next argument as the input filename and skip over it
                input_file = argv[++i];
            } else {
                // Print an error message because --file needs a filename
                fprintf(stderr, "Error: --file requires a filename\n");
                // Exit with error code 1
                return 1;
            }
        }
        // If we get here, this is an unknown argument
        else {
            // Print an error message with the unknown argument
            fprintf(stderr, "Unknown option: %s\n", argv[i]);
            // Print the help message
            print_usage(argv[0]);
            // Exit with error code 1
            return 1;
        }
    }
    
    // Print the program title
    printf("=== Day 12: JSAbacusFramework.io ===\n");
    // Check if we're supposed to ignore a specific color
    if (omit_color) {
        // Print which color we're ignoring
        printf("Mode: Ignoring objects with color '%s'\n", omit_color);
    } else {
        // Print that we're summing all numbers (Part 1)
        printf("Mode: Summing all numbers\n");
    }
    // Print a blank line
    printf("\n");
    
    // Check if the user wants to run tests
    if (run_tests) {
        // Run the Part 1 tests (with no color ignored)
        test_examples(NULL);
        
        // If we're ignoring a color, also run the Part 2 tests
        if (omit_color) {
            // Run the Part 2 specific tests
            test_examples_part2(omit_color);
        }
    }
    
    // Read the input file into memory
    char* json_content = read_file(input_file);
    // Check if reading the file failed
    if (!json_content) {
        // Print an error message
        printf("Failed to read input file: %s\n", input_file);
        // Exit with error code 1
        return 1;
    }
    
    // Create a pointer to the beginning of the JSON content
    const char* json_ptr = json_content;
    // Parse the JSON and calculate the total sum
    long total_sum = parse_json_sum(&json_ptr, omit_color);
    
    // Print the solution header
    printf("=== Solution ===\n");
    // Check if we ignored a color
    if (omit_color) {
        // Print the result with the color we ignored
        printf("Total sum of all numbers (ignoring objects with '%s'): %ld\n", omit_color, total_sum);
    } else {
        // Print the result for Part 1
        printf("Total sum of all numbers: %ld\n", total_sum);
    }
    
    // Free the memory we allocated for the file content (prevent memory leak)
    free(json_content);
    
    // Exit successfully with code 0
    return 0;
} 