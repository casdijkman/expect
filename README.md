# expect

`expect` is a simple javascript expect library designed to be minimal but effective.
This library enables you to write simple assertions with the following syntax:

```javascript
import { describe, expect } from '@casd/expect';

describe('0 is a number').expect(0).to.be.a('number');         // => true
describe('0 is not an object').expect(0).not.to.be.an(Object); // => true
```
