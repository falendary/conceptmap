function EventService() {

  events = {};

  function addEventListener(event, callback){

    if (!events[event]) {
      events[event] = []
    }

    events[event].push(callback);

  }

  function dispatchEvent(event){

      console.log("Event Dispatched: ", event);

      if (events[event]) {

        events[event].forEach(function(callback){
            callback();
        })

      }

  }

  return {
    
    addEventListener: addEventListener,
    dispatchEvent: dispatchEvent

  }

}