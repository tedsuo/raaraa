// # DEV MODE
module.exports = {

// ## watch_list
// List of files and directories to monitor.
// Not recursive.
  watch_list: [
    'bin',
    'config.js',
    'images',
    'lib',
    'node_modules',
    'raaraa',
    'raaraa/lib',
    'raaraa/models',
    'server',
    'test',
    'test/lib',
    'templates'
  ],

// ## processes
  processes: [

// ### RaaRaa dev server
    {
      name: 'Dev Server',
      prompt: 'R',
      color: 'magenta',
      command: 'node',
      args: [__dirname+'/server'],
      options: { 
        env: {PORT:9001, NODE_ENV:'development'}
      }
    },

// ### nodeunit tests
    {
      name: 'Tests',
      prompt: 'T',
      color: 'gray',
      command: 'nodeunit',
      args: ['/test'],
      options: { 
        env: {PORT:9003, NODE_ENV:'test'}
      }
    },

// ### docco document generation
    {
      name: 'Docco',
      prompt: 'D',
      color: 'blue',
      command: 'node',
      on_startup: false,
      args: [ 
        __dirname+'/lib/docco/bin/docco',
        '--structured',
        '[[file_path]]'
      ]
    }
  ]
}