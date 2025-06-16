# Development Guidelines for FullCycle DDD Project

This document provides essential information for developers working on this Domain-Driven Design (DDD) project.

## Build/Configuration Instructions

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (v6 or higher)

### Project Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile TypeScript:
   ```bash
   npx tsc
   ```

### Project Structure
- `src/domain/`: Contains domain entities, value objects, repositories interfaces, and services
  - `@shared/`: Shared components like events and interfaces
  - Domain modules (customer, product, checkout): Each follows a similar structure with entities, repositories, services
- `src/infrastructure/`: Implementation of repositories using Sequelize ORM
- `src/utils/`: Utility functions

## Testing Information

### Running Tests
The project uses Jest for testing. Run tests with:

```bash
npm test
```

Or run specific tests:

```bash
npx jest path/to/test/file.spec.ts
```

### Test Structure
- Tests are located alongside the files they test with a `.spec.ts` extension
- Follow the pattern of `describe` blocks for test suites and `it` blocks for individual tests
- Use `expect` for assertions

### Types of Tests
1. **Unit Tests**: Test individual components in isolation
   - Example: `src/domain/product/entity/product.spec.ts`

2. **Integration Tests**: Test interactions between components
   - Example: Repository tests that interact with the database
   - Example: `src/infrastructure/product/repository/sequelize/product.repository.spec.ts`

### Creating New Tests
1. Create a file with the `.spec.ts` extension next to the file you're testing
2. Follow the existing patterns for test structure
3. For repository tests, use the in-memory SQLite database as shown in existing tests

### Example Test
Here's a simple test for a string utility function:

```typescript
// src/utils/string-formatter.spec.ts
import { capitalizeWords } from "./string-formatter";

describe("String formatter utility tests", () => {
  describe("capitalizeWords", () => {
    it("should capitalize the first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
    });
    
    it("should handle empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });
  });
});
```

## Database Configuration

The project uses Sequelize with SQLite for testing:

```typescript
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
  sync: { force: true },
});
```

For production, you would configure Sequelize with your database of choice.

## Code Style and Development Guidelines

### Domain-Driven Design Principles
- Entities have identity and are mutable
- Value Objects are immutable and have no identity
- Aggregates enforce invariants for a group of objects
- Repositories provide persistence for aggregates
- Services handle operations that don't belong to entities or value objects

### TypeScript Best Practices
- Use strict type checking
- Define interfaces for repositories and services
- Use proper access modifiers (private, protected, public)
- Document complex functions with JSDoc comments

### Testing Guidelines
- Test all public methods and functions
- Test edge cases and error conditions
- Use descriptive test names that explain what is being tested
- Keep tests independent of each other

### Event-Driven Architecture
The project uses an event dispatcher pattern:
- Events are defined in domain modules
- Event handlers react to domain events
- The event dispatcher connects events to their handlers

## Debugging

- Use TypeScript source maps for better debugging
- Jest tests can be debugged using the Node.js debugger
- For VS Code, use the JavaScript Debug Terminal to run tests with breakpoints