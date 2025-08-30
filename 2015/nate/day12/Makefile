# These are variables that define where different types of files are stored in our project
# Directory structure
# This variable holds the name of the folder where we keep our C source code files
SRC_DIR = src
# This variable holds the name of the folder where we keep our input data files
DATA_DIR = data
# This variable holds the name of the folder where compiled programs will be stored
BIN_DIR = bin
# This variable holds the name of the folder where temporary build files will be stored
BUILD_DIR = build
# This variable holds the name of the folder where documentation files are stored
DOCS_DIR = docs

# These are settings that tell the computer how to compile our C program
# Compiler settings
# This tells the computer to use the gcc compiler (the program that turns C code into machine code)
CC = gcc
# These are flags (options) we give to the compiler:
# -Wall means show all warnings (help us find potential problems)
# -Wextra means show extra warnings (even more helpful)
# -std=c99 means use the C99 standard (a specific version of the C language)
# -O2 means optimize the code for speed (make it run faster)
CFLAGS = -Wall -Wextra -std=c99 -O2
# This is the name we want to give to our final compiled program
TARGET = day12
# This is the path to our main C source code file
SOURCE = $(SRC_DIR)/day12.c

# This line automatically creates the bin/ and build/ folders if they don't exist
# Ensure directories exist
# The $(shell ...) runs a command in the shell - mkdir -p creates folders
$(shell mkdir -p $(BIN_DIR) $(BUILD_DIR))

# This is the default target - when you just type 'make' without any arguments, this is what happens
# Default target
# The 'all' target is what gets built when you run 'make' by itself
all: $(BIN_DIR)/$(TARGET)

# This rule tells the computer how to build our program
# Build the program
# This line says: "if the program doesn't exist OR if the source file is newer than the program, rebuild it"
$(BIN_DIR)/$(TARGET): $(SOURCE)
	# This is the actual command that compiles our C code into a program
	# $(CC) expands to 'gcc'
	# $(CFLAGS) expands to '-Wall -Wextra -std=c99 -O2'
	# -o tells gcc where to put the output file
	# $(BIN_DIR)/$(TARGET) expands to 'bin/day12'
	# $(SOURCE) expands to 'src/day12.c'
	$(CC) $(CFLAGS) -o $(BIN_DIR)/$(TARGET) $(SOURCE)

# These are targets for running our program in different ways
# Run the programs
# This target runs our program with the default input file (Part 1)
run: $(BIN_DIR)/$(TARGET)
	# This command runs our program with the -f flag to specify the input file
	$(BIN_DIR)/$(TARGET) -f $(DATA_DIR)/input.txt

# This target runs our program specifically for Part 1
run-part1: $(BIN_DIR)/$(TARGET)
	# This command runs our program with the -p flag (Part 1) and specifies the input file
	$(BIN_DIR)/$(TARGET) -p -f $(DATA_DIR)/input.txt

# This target runs our program specifically for Part 2
run-part2: $(BIN_DIR)/$(TARGET)
	# This command runs our program with the -r flag (Part 2, ignore red) and specifies the input file
	$(BIN_DIR)/$(TARGET) -r -f $(DATA_DIR)/input.txt

# These are targets for running tests to make sure our program works correctly
# Test with examples only
# This target runs our program with the test flag to run example tests
test: $(BIN_DIR)/$(TARGET)
	# This command runs our program with the -t flag (run tests) and specifies the input file
	$(BIN_DIR)/$(TARGET) -t -f $(DATA_DIR)/input.txt

# This target runs only the Part 1 tests
test-part1: $(BIN_DIR)/$(TARGET)
	# This command runs our program with both -p (Part 1) and -t (test) flags
	$(BIN_DIR)/$(TARGET) -p -t -f $(DATA_DIR)/input.txt

# This target runs only the Part 2 tests
test-part2: $(BIN_DIR)/$(TARGET)
	# This command runs our program with both -r (Part 2) and -t (test) flags
	$(BIN_DIR)/$(TARGET) -r -t -f $(DATA_DIR)/input.txt

# This target shows help information about how to use our program
# Show help
# This target runs our program with the help flag to show usage instructions
help: $(BIN_DIR)/$(TARGET)
	# This command runs our program with the --help flag to display help information
	$(BIN_DIR)/$(TARGET) --help

# This target removes all the files that were created during building
# Clean up
# This target deletes all files in the bin/ and build/ directories
clean:
	# This command removes all files in the bin/ and build/ directories
	# rm -rf means remove recursively and forcefully (don't ask for confirmation)
	rm -rf $(BIN_DIR)/* $(BUILD_DIR)/*

# This target is a placeholder for installing any external dependencies
# Install dependencies (if any)
# This target doesn't do anything since our program doesn't need any external libraries
install:
	# This command prints a message saying no external dependencies are needed
	@echo "No external dependencies required"

# These are targets for common development tasks
# Development targets
# This target does a complete development cycle: clean, build, and test
dev: clean all test

# This target shows the structure of our project folders
# Show directory structure
# This target displays a visual representation of how our project is organized
tree:
	# These commands print out the directory structure in a nice tree format
	@echo "Directory structure:"
	# Show the source files directory
	@echo "├── src/          # Source files"
	# Show the input data files directory
	@echo "├── data/         # Input data files"
	# Show the compiled binaries directory
	@echo "├── bin/          # Compiled binaries"
	# Show the build artifacts directory
	@echo "├── build/        # Build artifacts"
	# Show the documentation directory
	@echo "├── docs/         # Documentation"
	# Show the build configuration file
	@echo "└── Makefile     # Build configuration"

# This line tells Make that these targets don't create files with the same names
# Help
# .PHONY tells Make that these targets are just actions, not files to create
.PHONY: all run run-part1 run-part2 test test-part1 test-part2 help clean install dev tree 