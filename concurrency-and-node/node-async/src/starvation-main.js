var recluster = require('recluster'),
    path = require('path'),
    llb = require('least-latency-balancer')

var cluster = recluster(path.join(__dirname, 'server.js'), {
  readyWhen: 'ready'
});

cluster.run();

process.on('SIGUSR2', function() {
    console.log('Got SIGUSR2, reloading cluster...');
    cluster.reload();
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");

// Added for the llb:

var balancer = llb.createBalancer({
  activeWorkers: cluster.activeWorkers
});

balancer.listen(8082, function() {
  console.log("Least latency balancer listening on port", 8082);
});

