
Pellets v0.0.1
=======================

Modest javascript html-templates.

Syntax
-----------------------

Pellets is intended when you want html templating in plain javascript, without littering your code with unsightly `<% %>`'s.

### Rendering some HTML

Let's start with the bare minimum:

    if(this.showHeader)
      <h1>This is a header</h1>

    // > pellets.compile(template)({ showHeader: true })
    // "<h1>This is a header</h1>"

Any HTML embedded as its own statement will be parsed.

### Interpolation

Strings can be interpolated anywhere with the at(`@`) symbol, and are automatically appended to the output:

    <div>@this.interpolated</div>
    for(var i=0; i<10; ++i) {
      @i
    }

    // > pellets.compile(template)({ interpolated: "<br>" })
    // "<div>&lt;br&gt;</div>0123456789"

### HTML interpolation 

All values interpolated with `@` are html-encoded. To print html you can double up to `@@`..

    @@this.interpolated

    // > pellets.compile(template)({ interpolated: "<br>" })
    // "<br>"

or add an `html` value or function to the object.

    @this.interpolated

    // > pellets.compile(template)({ interpolated: { html: "<br>" } })
    // "<br>"

### Keywords

Keywords can't be used directly inside an html-block, as it will be parsed as text:

    <div>
      for(var i=0; i<2; ++i) {
        var j = i * 2;
        <li>@j</li>
      }
    </div>

    // > pellets.compile(template)()
    // ReferenceError: i is not defined


But the `@` symbol allows you to treat them as normal code:

    <ul>
      @for(var i=0; i<2; ++i) {
        var j = i * 2;
        <li>@j</li>
      }
    </ul>
    
    // > pellets.compile(template)()
    // "<ul>\n<li>0</li>\n<li>2</li>\n</ul>"

This works for all normal javascript keywords, so you can add a variable while in HTML..

    <ul>@var i = 5;</ul>

or define a function.

    <ul>@function x() { return 123; }</ul>

### Blocks

A code block can be appended using the `@` symbol followed by a curly brace:

    <div>
      @{
        var i = 5;
        if(i < 10) { <hr> }
      }
    </div>
 
    // > pellets.compile(template)()
    // "<div><hr></div>"

### Functions

If a function contains any html or `@`-expressions, these will be automatically returned by default. Aside from that, they work like normal.

    function render(x) {
      @x
    }

    var a = render(1);
    @render(2);
    @a
 
    // > pellets.compile(template)()
    // "21"

Usage
-----------------------

### Node.js

    $ npm install pellets
    $ node

    > var template = "<h1>@this.v</h1>";
    > var pellets = require("pellets");
    > var method = pellets.compile(template);
    > console.log(method({ v: 123 }));
    "<h1>123</h1>

### Browser

    <script id='tmpl' type='text/pellet'>
      <h1>@this.v</h1>
    </script>
    <script src='https://raw.github.com/sciolist/pellets/master/browser/pellets.min.js'></script>
    <script>
      var method = pellets.compileElement('tmpl'); // or compile(str)
      console.log(method({ v: 123 }));
    </script>

Gotchas
-----------------------

There are a few things that become ambiguous when combining HTML and JavaScript. 
These situations will usually result in HTML being parsed as JavaScript code.

### Parens next to interpolations

Writing a template like:

    <div>@i (this bit will break)</div>

will interpret as a method call:

    i(this bit will break)

to avoid this, you'll need to wrap i in a paren:

    <div>@(i) (this bit wont break)</div>

### Missing semicolons after expressions

Writing a template like:

    @if(true)
      doSomething()

    <br>123

will interpret the `<br>` tag as a comparison on `doSomething()`:

    if(true) {
      doSomething() < br > 123
    }

this can be avoided by adding a semicolon to expressions before HTML, or wrapping with blocks:

    @if(true)
      doSomething();
    <br>123

    // or..
    @if(true) {
      doSomething()
    }
    <br>123

    // or..
    @if(true)
      doSomething()
    { <br>123 }



