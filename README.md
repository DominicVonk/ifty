# Ifty

Ifty makes statements easy to read and write.

## Installation

```bash
npm install ifty
```

## Implementation

```javascript
import { ifty } from 'ifty'; // Sync
import { iftyAsync } from 'ifty'; // Async
```

## Usage

### normal statement

```javascript
const result = ifty(1)
  .matches(1, 'one')
  .matches(2, 'two')
  .matches(3, 'three')
  .else('other')
  .resolve();
```

### statement with in operator
```javascript
const result = ifty(1)
  .matches({in: [1]}, 'one')
  .else('other')
  .resolve();
```

### statement with range operator
```javascript
const result = ifty(1)
  .matches({range: [1, 3]}, 'one')
  .else('other')
  .resolve();
```

### statement with regex operator
```javascript
const result = ifty('foo')
  .matches(/foo/, 'one')
  .else('other')
  .resolve();
```

### statement with function operator
```javascript
const result = ifty(1)
  .matches((value) => value === 1, 'one')
  .else('other')
  .resolve();
```

### statement with startswith operator
```javascript
const result = ifty('foo')
  .matches({startsWith: 'f'}, 'one')
  .else('other')
  .resolve();
```

### statement with endswith operator
```javascript
const result = ifty('foo')
  .matches({endsWith: 'o'}, 'one')
  .else('other')
  .resolve();
```

### statement with contains operator
```javascript
const result = ifty('foo')
  .matches({contains: 'oo'}, 'one')
  .else('other')
  .resolve();
```

### statement with multiple operators
```javascript
const result = ifty(1)
  .matches({in: [1]}, 'one')
  .matches({range: [1, 3]}, 'two')
  .matches(/foo/, 'three')
  .matches((value) => value === 1, 'four')
  .else('other')
  .resolve();
```

### statement with throw instead of else
```javascript
const result = ifty(99)
  .matches({in: [1]}, 'one')
  .matches({range: [1, 3]}, 'two')
  .matches(/foo/, 'three')
  .matches((value) => value === 1, 'four')
  .throw('Not found')
  .resolve();
```

### async statement
```javascript
const result = await iftyAsync(1)
  .matches(Promise.resolve({in: [1]}), Promise.resolve('one'))
  .else('other')
  .resolve();
```

### async statement with throw instead of else
```javascript
const result = await iftyAsync(99)
  .matches(Promise.resolve({in: [1]}), Promise.resolve('one'))
  .matches(Promise.resolve({range: [1, 3]}), Promise.resolve('two'))
  .matches(Promise.resolve(/foo/), Promise.resolve('three'))
  .matches(Promise.resolve((value) => value === 1), Promise.resolve('four'))
  .throw('Not found')
  .resolve();
```

