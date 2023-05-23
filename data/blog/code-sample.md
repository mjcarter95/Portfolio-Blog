---
title: Oh what a beautiful morning
date: '2023-05-22'
tags: ['python', 'test']
draft: false
authors: ['default']
summary: Oh what a beautiful morning. Oh what a beautiful day. I've got a beautiful feeling. Some Python code is coming your way.
---

Oh what a beautiful morning.

`Oh what a beautiful day`.

I've got a beautiful feeling.

Some Python code is coming your way 🐍

```python
def fib():
    a, b = 0, 1
    while True:            # First iteration:
        yield a            # yield 0 to start with and then
        a, b = b, a + b    # a will now be 1, and b will also be 1, (0 + 1)

for index, fibonacci_number in zip(range(10), fib()):
     print('{i:3}: {f:3}'.format(i=index, f=fibonacci_number))
```
