### Very Simple Logger

For output to the console.
Lightweight and no dependency.

You can set parameters: **type, level, colorize**
Has three level for output: **info, debug, silent**

Available types: **simple | json**
Available levels: **info | debug | silent**
Available times: **iso | local**

logger methods: **debug (IL) | info (IL) | warn (EL) | error (EL)**

```javascript
import logger from './index';

logger
  .setType('json')
  .setLevel('info')
  .setColorize(true);
  .setTime('iso');
```
Arguments for call the logger:
  - message: string | number
  - params: object

Code
```javascript
logger.info('Call info logger', { hello: 'world', milky: 'way'})
```
JSON Ouput
```json
{"timestamp":"2020-04-18T22:00:53.118Z","level":"info","message":"Call info logger","params":{"hello":"world","milky":"way"}}
```
Simple Output
```
2020-04-18T22:00:34.215Z [info]   Call info logger    params: hello -> world | milky -> way
```
