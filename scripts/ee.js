var event = new Event('build');

let elem;
// Listen for the event.
elem.addEventListener('build', function (e) { 
	console.log("Event!")
}, false);

// Dispatch the event.
console.log("dispatch")
elem.dispatchEvent(event);