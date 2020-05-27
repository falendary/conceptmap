function InterfaceModule(dataService, eventService) {

  var userPositionElem;
  var activeSpace;
  var activeSpaceElem;
  var constants;

  function setEventListeners(){



  }

  function init(){

    setEventListeners();

    activeSpace = dataService.getActiveSpace();
    activeSpaceElem = dataService.getActiveSpaceElem();

    constants = dataService.getConstants();

    console.log('interface activeSpaceElem', activeSpaceElem);

    userPositionElem = document.querySelector('.user-position')

    document.querySelector('.to-center-button').addEventListener('click', function(event){

      document.querySelector('.to-center-button').addEventListener('click', function(event){

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      activeSpaceElem.style.left = -constants.OFFSET_LEFT + halfScreenWidth + 'px';
      activeSpaceElem.style.top = -constants.OFFSET_TOP + halfScreenHeight + 'px';

      window.location.hash = '#/'

    })

    })

    document.querySelector('.add-card-button').addEventListener('click', function(event){

      if(!activeSpace.cards) {
        activeSpace.cards = []
      }

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      var diffLeft = -constants.OFFSET_LEFT - left;
      var diffTop = -constants.OFFSET_TOP - top;

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      activeSpace.cards.push({
        spaceId: activeSpace.id,
        id: toMD5('card_' + new Date()),
        position: {
          x: constants.OFFSET_LEFT + diffLeft + halfScreenWidth - 90,
          y: constants.OFFSET_TOP + diffTop + halfScreenHeight - 120
        },
        style: {
          width: 180,
          height: 240
        },
        title: 'Hello there',
        text: ''
      })

      console.log('Card added', activeSpace);

      eventService.dispatchEvent(EVENTS.RENDER_CARDS)

    })

    document.querySelector('.save-button').addEventListener('click', function(event) {

        var data = {
          spaces: dataService.getSpaces()
        }

        fetch('/api/save', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(function(data){
            toastr.info('Сохранено')
        })

    })

    document.querySelector('.export-button').addEventListener('click', function(event) {

      var body = {
          spaces: dataService.getSpaces()
      }

      var date = new Date().toISOString().split('T')[0]

      downloadFile(JSON.stringify(body), 'application/json', 'Concept Map ' + date + '.json')

    })

    document.body.addEventListener('mousemove', function(event) {

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      userPositionElem.innerHTML = 'X: '+ (-(left + constants.OFFSET_LEFT - event.clientX)) + ', Y:' + (top + constants.OFFSET_TOP - event.clientY);

    })

    document.querySelector('.search-box-button').addEventListener('click', function(event) {

      var input = document.querySelector('.search-box-input');

      window.location.hash = '#/';

      setTimeout(function(){

        window.location.hash = '#/goto=' + input.value;

      }, 0)


    })

  }

  return {
    init: init
  }

}