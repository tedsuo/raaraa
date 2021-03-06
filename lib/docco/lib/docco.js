(function() {
  var arg, args, css_file, destination, docco_scripts, docco_styles, docco_template, ensure_directory, exec, ext, filter, fs, generate_documentation, generate_html, get_language, highlight, highlight_end, highlight_start, inline, l, languages, parse, path, patterns, recursive, run_script, showdown, sources, spawn, structured, template, template_file, version, walkCb, watch, _ref;
  version = '0.3.1';
  generate_documentation = function(source, callback) {
    return fs.readFile(source, "utf-8", function(error, code) {
      var sections;
      if (error) {
        throw error;
      }
      sections = parse(source, code);
      return highlight(source, sections, function() {
        generate_html(source, sections);
        return callback();
      });
    });
  };
  parse = function(source, code) {
    var code_text, docs_text, has_code, language, line, lines, save, sections, _i, _len;
    lines = code.split('\n');
    sections = [];
    language = get_language(source);
    has_code = docs_text = code_text = '';
    save = function(docs, code) {
      return sections.push({
        docs_text: docs,
        code_text: code
      });
    };
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      if (line.match(language.comment_matcher) && !line.match(language.comment_filter)) {
        if (has_code) {
          save(docs_text, code_text);
          has_code = docs_text = code_text = '';
        }
        docs_text += line.replace(language.comment_matcher, '') + '\n';
      } else {
        has_code = true;
        code_text += line + '\n';
      }
    }
    save(docs_text, code_text);
    return sections;
  };
  highlight = function(source, sections, callback) {
    var language, output, pygments, section;
    language = get_language(source);
    pygments = spawn('pygmentize', ['-l', language.name, '-f', 'html', '-O', 'encoding=utf-8,tabsize=2']);
    output = '';
    pygments.stderr.addListener('data', function(error) {
      if (error) {
        return console.error(error.toString());
      }
    });
    pygments.stdin.addListener('error', function(error) {
      console.error("Could not use Pygments to highlight the source.");
      return process.exit(1);
    });
    pygments.stdout.addListener('data', function(result) {
      if (result) {
        return output += result;
      }
    });
    pygments.addListener('exit', function() {
      var fragments, i, section, _len;
      output = output.replace(highlight_start, '').replace(highlight_end, '');
      fragments = output.split(language.divider_html);
      for (i = 0, _len = sections.length; i < _len; i++) {
        section = sections[i];
        section.code_html = highlight_start + fragments[i] + highlight_end;
        section.docs_html = showdown.makeHtml(section.docs_text);
      }
      return callback();
    });
    if (pygments.stdin.writable) {
      pygments.stdin.write(((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sections.length; _i < _len; _i++) {
          section = sections[_i];
          _results.push(section.code_text);
        }
        return _results;
      })()).join(language.divider_text));
      return pygments.stdin.end();
    }
  };
  generate_html = function(source, sections) {
    var dest, html, relative_destination, title;
    title = path.basename(source);
    dest = destination(source);
    relative_destination = structured ? function(source) {
      return (path.dirname(dest) + '/').replace(/[^\/]*\//g, '../') + destination(source);
    } : function(source) {
      return path.basename(destination(source));
    };
    html = docco_template({
      title: title,
      styles: inline ? docco_styles : '',
      scripts: inline ? docco_scripts : '',
      sections: sections,
      sources: structured ? sources : sources.map(function(source) {
        return path.basename(source);
      }),
      relative_destination: relative_destination
    });
    console.log("docco: " + source + " -> " + dest);
    return ensure_directory(path.dirname(dest), function() {
      return fs.writeFile(dest, html);
    });
  };
  fs = require('fs');
  path = require('path');
  watch = require('watch');
  showdown = require('./../vendor/showdown').Showdown;
  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;
  languages = {
    '.coffee': {
      name: 'coffee-script',
      symbol: '#'
    },
    '.js': {
      name: 'javascript',
      symbol: '//'
    },
    '.rb': {
      name: 'ruby',
      symbol: '#'
    },
    '.py': {
      name: 'python',
      symbol: '#'
    }
  };
  for (ext in languages) {
    l = languages[ext];
    l.comment_matcher = new RegExp('^\\s*' + l.symbol + '\\s?');
    l.comment_filter = new RegExp('(^#![/]|^\\s*#\\{)');
    l.divider_text = '\n' + l.symbol + 'DIVIDER\n';
    l.divider_html = new RegExp('\\n*<span class="c1?">' + l.symbol + 'DIVIDER<\\/span>\\n*');
  }
  get_language = function(source) {
    return languages[path.extname(source)];
  };
  destination = function(filepath) {
    return 'docs/' + (structured ? path.dirname(filepath) + '/' : '') + path.basename(filepath, path.extname(filepath)) + '.html';
  };
  ensure_directory = function(dir, callback) {
    return exec("mkdir -p " + dir, function() {
      return callback();
    });
  };
  template = function(str) {
    return new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' + 'with(obj){p.push(\'' + str.replace(/[\r\t\n]/g, " ").replace(/'(?=[^<]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "',$1,'").split('<%').join("');").split('%>').join("p.push('") + "');}return p.join('');");
  };
  sources = [];
  args = process.ARGV.slice();
  while (args.length) {
    switch (arg = args.shift()) {
      case '--version':
        console.log('Docco v' + version);
        return;
      case '-r':
        inline = structured = recursive = true;
        break;
      case '--structured':
      case '-s':
        inline = structured = true;
        break;
      case '--inline':
        inline = true;
        break;
      case '--css':
      case '-c':
        if (args.length) {
          css_file = args.shift();
        }
        break;
      case '--template':
      case '-t':
        if (args.length) {
          template_file = args.shift();
        }
        break;
      default:
        sources.push(arg);
    }
  }
  if (template_file != null) {
    docco_template = template(fs.readFileSync(template_file).toString());
  }
  if (!(docco_template != null)) {
    docco_template = template(fs.readFileSync(__dirname + '/../resources/docco.jst').toString());
  }
  if (css_file != null) {
    docco_styles = fs.readFileSync(css_file).toString();
  }
  if (!(docco_styles != null)) {
    docco_styles = fs.readFileSync(__dirname + '/../resources/docco.css').toString();
  }
  if (typeof js_file !== "undefined" && js_file !== null) {
    docco_scripts = fs.readFileSync(js_file).toString();
  }
  if (!(docco_scripts != null)) {
    docco_scripts = fs.readFileSync(__dirname + '/../resources/docco.js').toString();
  }
  highlight_start = '<div class="highlight"><pre>';
  highlight_end = '</pre></div>';
  run_script = function() {
    sources = sources.map(function(s) {
      return path.normalize(s);
    });
    sources.sort();
    if (sources.length) {
      return ensure_directory('docs', function() {
        var files, next_file;
        if (!inline) {
          fs.writeFile('docs/docco.css', docco_styles);
        }
        if (!inline) {
          fs.writeFile('docs/docco.js', docco_scripts);
        }
        files = sources.slice();
        next_file = function() {
          if (files.length) {
            return generate_documentation(files.shift(), next_file);
          }
        };
        return next_file();
      });
    }
  };
  if (recursive) {
    patterns = sources.map(function(s) {
      return RegExp('^' + s + '$');
    });
    sources = [];
    filter = function(file) {
      var p, _i, _len;
      if (!patterns.length) {
        return true;
      }
      for (_i = 0, _len = patterns.length; _i < _len; _i++) {
        p = patterns[_i];
        if (p.test(file)) {
          return true;
        }
      }
    };
    walkCb = function(err, files) {
      var f;
      for (f in files) {
        f = path.resolve(f).replace(process.cwd() + "/", "");
        if (filter(f)) {
          sources.push(f);
        }
      }
      return run_script();
    };
    watch.walk(process.cwd(), walkCb);
  } else {
    run_script();
  }
}).call(this);
