# /component-builder

Build SDUI components and subcomponents from JSON templates and visual prototypes using the project's Factory Pattern.

Load the `component-builder` skill from MCP, then:

1. Ask the user for the JSON file path (and optional prototype image)
2. Analyze the JSON to identify components and subcomponents
3. Verify which types already exist in `Contenedores.kt` and `Anidados.kt`
4. Generate code for NEW types across all factory files
5. Present a summary of all files created/modified
6. User compiles and validates
