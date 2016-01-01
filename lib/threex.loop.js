var THREEx	= THREEx	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		THREEx.Loop							//
//////////////////////////////////////////////////////////////////////////////////

THREEx.Loop	= function(){
	this._fcts	= []
}

THREEx.Loop.prototype.add	= function(fct){
	this._fcts.push(fct)
	return fct
}

THREEx.Loop.prototype.remove	= function(fct){
	var index	= this._fcts.indexOf(fct)
	if( index === -1 )	return
	this._fcts.splice(index,1)
}

THREEx.Loop.prototype.update	= function(delta){
	this._fcts.forEach(function(fct){
		fct(delta)
	})
}


//////////////////////////////////////////////////////////////////////////////////
//		THREEx.RenderingLoop						//
//////////////////////////////////////////////////////////////////////////////////
THREEx.RenderingLoop	= function(){
	THREEx.Loop.call(this)

	this.maxDelta	= 0.2
	var requestId	= null
	var lastTimeMsec= null
	var onRequestAnimationFrame	= function(nowMsec){
		// keep looping
		requestId	= requestAnimationFrame( onRequestAnimationFrame );

		// measure time - never notify more than this.maxDelta
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(this.maxDelta*1000, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		this.update(deltaMsec/1000)
	}.bind(this)


	//////////////////////////////////////////////////////////////////////////////////
	//		start/stop/isRunning functions					//
	//////////////////////////////////////////////////////////////////////////////////
	this.start	= function(){
		console.assert(this.isRunning() === false)
		requestId	= requestAnimationFrame(onRequestAnimationFrame)
	}
	this.isRunning	= function(){
		return requestId ? true : false
	}
	this.stop	= function(){
		if( requestId === null )	return
		cancelAnimationFrame(requestId)
		requestId	= null
	}
}

THREEx.RenderingLoop.prototype = Object.create( THREEx.Loop.prototype );



//////////////////////////////////////////////////////////////////////////////////
//		THREEx.PhysicsLoop						//
//////////////////////////////////////////////////////////////////////////////////
THREEx.PhysicsLoop	= function(rate){
	THREEx.Loop.call(this)

	this.rate	= rate !== undefined ? rate : 60
	var timerId	= null
	var onInterval	= function(){
		var delta	= 1/this.rate
		// relaunch the setTimeout
		timerId	= setTimeout(onInterval, delta*1000)
		// call each update function
		this.update(delta)
	}.bind(this)


	//////////////////////////////////////////////////////////////////////////////////
	//		start/stop/isRunning functions					//
	//////////////////////////////////////////////////////////////////////////////////
	this.start	= function(){
		console.assert(this.isRunning() === false)
		timerId	= setTimeout(onInterval, 0)
	}
	this.isRunning	= function(){
		return timerId ? true : false
	}
	this.stop	= function(){
		if( timerId === null )	return
		clearInterval(timerId)
		timerId	= null
	}
}

THREEx.PhysicsLoop.prototype = Object.create( THREEx.Loop.prototype );


//////////////////////////////////////////////////////////////////////////////////
//		THREEx.Loop							//
//////////////////////////////////////////////////////////////////////////////////

THREEx.PriorityLoop	= function(){
	this._fcts	= []
}

THREEx.PriorityLoop.prototype.add	= function(priority, fct){
	this._fcts[priority]	= this._fcts[priority] || [];
	console.assert(this._fcts[priority].indexOf(fct) === -1)
	this._fcts[priority].push(fct);
	return fct;
}

THREEx.PriorityLoop.prototype.remove	= function(priority, fct){
	var index	= this._fcts[priority].indexOf(fct);
	console.assert(index !== -1);
	this._fcts[priority].splice(index, 1);
	this._fcts[priority].length === 0 && delete this._fcts[priority]
}

THREEx.PriorityLoop.prototype.update	= function(delta){
	// run all the hooks - from lower priority to higher - in order of registration
	for(var priority = 0; priority <= this._fcts.length; priority++){
		if( this._fcts[priority] === undefined )	continue;
		var callbacks	= this._fcts[priority].slice(0)
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](delta);
		}
	}
}

