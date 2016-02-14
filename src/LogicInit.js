if('function'===typeof importScripts){
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    importScripts('../../dist/logic.min.js');
    self.core = new Core(self);
}
