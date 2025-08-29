Visit: (https://json-schema-builder-red-mu.vercel.app/)


# JSON Schema Builder

A flexible and powerful library for programmatically building, modifying, and validating [JSON Schema](https://json-schema.org/) definitions in JavaScript/TypeScript. The JSON Schema Builder aims to simplify the process of generating dynamic and complex schema structures for APIs, form validation, data modeling, and more.

---

## Features

- **Fluent API:** Easily compose schemas using chainable methods.
- **TypeScript Support:** Full typings for development experience and code completion.
- **Validation:** Validate data against built schemas.
- **Extensible:** Create reusable schema fragments and combine them.
- **JSON Schema Draft Support:** Compatible with JSON Schema Draft-07 and beyond.
- **Serialization:** Export schemas as plain JSON for interoperability.

---

## Installation

```bash
npm install json_schema_builder
# or
yarn add json_schema_builder
```

---

## Usage

### Basic Example

```javascript
const { SchemaBuilder } = require('json_schema_builder');

const userSchema = new SchemaBuilder()
  .object()
  .prop('id', s => s.integer().minimum(1).required())
  .prop('username', s => s.string().minLength(3).required())
  .prop('email', s => s.string().format('email'))
  .build();

console.log(JSON.stringify(userSchema, null, 2));
```

### Advanced Example

```javascript
const { SchemaBuilder } = require('json_schema_builder');

const addressSchema = new SchemaBuilder()
  .object()
  .prop('street', s => s.string().required())
  .prop('city', s => s.string().required())
  .prop('zipcode', s => s.string().pattern('^\\d{5}$'))
  .build();

const userSchema = new SchemaBuilder()
  .object()
  .prop('name', s => s.string().required())
  .prop('address', s => s.schema(addressSchema))
  .build();
```

---

## API Reference

### Core Classes

- **SchemaBuilder**: The main class for composing schemas.
- **.object()**: Start an object schema.
- **.prop(key, schemaFn)**: Add a property with its own schema.
- **.array()**: Define an array schema.
- **.string(), .integer(), .boolean(), .number()**: Define primitive types.
- **.required()**: Mark a field as required.
- **.enum([...])**: Restrict to specific values.
- **.build()**: Export the schema as plain JSON.

### Validation

```javascript
const { validate } = require('json_schema_builder');

const schema = ...; // your built schema
const { valid, errors } = validate(schema, data);
```

---

## Contribution

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and include tests if relevant.
4. Open a pull request describing your changes.

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md) (if available).

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support & Contact

For issues or feature requests, please open an [issue](https://github.com/kritiayush11/json_schema_builder/issues).

For questions or other inquiries, reach out to [kritiayush11](https://github.com/kritiayush11).

---
  },
])
```
