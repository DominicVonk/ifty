# Ifty

Ifty makes statements easy to read and write.

## Installation

```bash
npm install ifty
```

## Implementation

```javascript
import { match } from 'ifty'; // Sync
import { matchAsync } from 'ifty'; // Async
```

## Usage

### normal statement

```javascript
const result = match(1)
  .when(1, 'one')
  .when(2, 'two')
  .when(3, 'three')
  .default('other')
  .resolve();
```

### statement with in operator
```javascript
const result = match(1)
  .when({in: [1]}, 'one')
  .default('other')
  .resolve();
```

### statement with range operator
```javascript
const result = match(1)
  .when({range: [1, 3]}, 'one')
  .default('other')
  .resolve();
```

### statement with regex operator
```javascript
const result = match('foo')
  .when(/foo/, 'one')
  .default('other')
  .resolve();
```

### statement with function operator
```javascript
const result = match(1)
  .when((value) => value === 1, 'one')
  .default('other')
  .resolve();
```

### statement with startswith operator
```javascript
const result = match('foo')
  .when({startsWith: 'f'}, 'one')
  .default('other')
  .resolve();
```

### statement with endswith operator
```javascript
const result = match('foo')
  .when({endsWith: 'o'}, 'one')
  .default('other')
  .resolve();
```

### statement with contains operator
```javascript
const result = match('foo')
  .when({contains: 'oo'}, 'one')
  .default('other')
  .resolve();
```

### statement with multiple operators
```javascript
const result = match(1)
  .when({in: [1]}, 'one')
  .when({range: [1, 3]}, 'two')
  .when(/foo/, 'three')
  .when((value) => value === 1, 'four')
  .default('other')
  .resolve();
```

### statement with throw instead of else
```javascript
const result = match(99)
  .when({in: [1]}, 'one')
  .when({range: [1, 3]}, 'two')
  .when(/foo/, 'three')
  .when((value) => value === 1, 'four')
  .throw('Not found')
  .resolve();
```

### async statement
```javascript
const result = await matchAsync(1)
  .when(Promise.resolve({in: [1]}), Promise.resolve('one'))
  .default('other')
  .resolve();
```

### async statement with throw instead of else
```javascript
const result = await matchAsync(99)
  .when(Promise.resolve({in: [1]}), Promise.resolve('one'))
  .when(Promise.resolve({range: [1, 3]}), Promise.resolve('two'))
  .when(Promise.resolve(/foo/), Promise.resolve('three'))
  .when(Promise.resolve((value) => value === 1), Promise.resolve('four'))
  .throw('Not found')
  .resolve();
```

