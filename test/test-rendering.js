var expect = require('expect.js'),
    pellets = require('../');

describe('rendering', function() {

  it('funcions should yield html fragments', function() {
    var code = "function test() { <br> } @test()";
    var result = pellets.compile(code)({ i : 5 });
    expect(result).to.match(/^\s*<br>\s*$/);
  });

  it('@ renders html-encoded values', function() {
    var code = "@this.test";
    var result = pellets.compile(code)({ test: "<br>" });
    expect(result).to.equal("&lt;br&gt;");
  });

  it('@@ renders raw values', function() {
    var code = "@@this.test";
    var result = pellets.compile(code)({ test: "<br>" });
    expect(result).to.equal("<br>");
  });

  it('can mix javascript and html', function() {
    var code = "this.test+=1;<br>";
    var obj = { test: 0 }
    var result = pellets.compile(code)(obj);
    expect(result).to.equal("<br>");
    expect(obj.test).to.equal(1);
  });

  it('block expressions are not rendered', function() {
    var code = "<div>@{ 'test' }</div>";
    var result = pellets.compile(code)({});
    expect(result).to.equal("<div></div>");
  });

  it('@ in block expressions are rendered', function() {
    var code = "<div>@{ @'test' }</div>";
    var result = pellets.compile(code)({});
    expect(result).to.equal("<div>test</div>");
  });

});

