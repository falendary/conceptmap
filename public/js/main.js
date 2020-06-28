var activeSpaceElem;
var activeSpace;

var dataService;
var eventService;

var constants;

var scale = 1;
var minScale = 0.1;
var maxScale = 1.5;

function initGlobalDragListener() {

  var startX;
  var startY;

  var lastX;
  var lastY;

  var currentY;
  var currentX;

  var mousePressed = false;
  var currentScale;

  document.body.addEventListener('mousedown', function(event) {

    // console.log('mousedown event', event);

    activeSpaceElem = dataService.getActiveSpaceElem();

    if (event.target.classList.contains('space-content')) {

      startX = event.clientX;
      startY = event.clientY;

      currentY = parseInt(activeSpaceElem.style.top.split('px')[0], 10);
      currentX = parseInt(activeSpaceElem.style.left.split('px')[0], 10);

      mousePressed = true;

    }

  })

  document.body.addEventListener('mouseup', function(event) {

    // console.log('mouseup event', event);

    mousePressed = false;

  })

  document.body.addEventListener('mousemove', function(event) {

    currentScale = dataService.getCurrentScale();

    if (mousePressed) {

      // console.log('mousemove event', event);

      lastX = event.clientX;
      lastY = event.clientY;

      if (!currentY){
          currentY = 0
      }

      if (!currentX){
          currentX = 0
      }

      var diffTop = lastY - startY;
      var diffLeft = lastX - startX;

      var resultTop = currentY + diffTop / currentScale
      var resultLeft = currentX + diffLeft / currentScale

      activeSpaceElem.style.top = resultTop + 'px';
      activeSpaceElem.style.left = resultLeft + 'px';

    }


  })

}

function initGlobalZoomListener(){

   $("body").on("mousewheel DOMMouseScroll", function (e) {

      if (!window.isDragging) {

      var delta = e.delta || e.originalEvent.wheelDelta;
      var zoomOut;
      if (delta === undefined) {
        //we are on firefox
        delta = e.originalEvent.detail;
        zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        zoomOut = !zoomOut;
      } else {
        zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      }
      var touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
      var touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
      
      var translateX, translateY;

      if(zoomOut){
        // we are zooming out
        scale = scale - 0.01;

        if (scale < minScale) {
          scale = minScale;
        }
        
        var offsetWidth = $(".zoom-wrap")[0].offsetWidth;
        var offsetHeight = $(".zoom-wrap")[0].offsetHeight;

        $(".zoom-wrap")
          .css("transform-origin", touchX + 'px ' + touchY + 'px')
          .css("transform", 'scale(' + scale + ')');
        
      } else {
        // we are zooming in
        scale = scale + 0.01;

        if (scale > maxScale) {
          scale = maxScale;
        }
        
        var offsetWidth = $(".zoom-wrap")[0].offsetWidth;
        var offsetHeight = $(".zoom-wrap")[0].offsetHeight;

        $(".zoom-wrap")
          .css("transform-origin", touchX + 'px ' + touchY + 'px')
          .css("transform", 'scale(' + scale + ')');
       }

       dataService.setCurrentScale(scale);

       eventService.dispatchEvent(EVENTS.SCALE_CHANGE)

     }

  });

}

function setSpaceToCenter() {

  var halfScreenWidth = document.body.clientWidth / 2;
  var halfScreenHeight = document.body.clientHeight / 2;

  activeSpaceElem.style.left = -constants.OFFSET_LEFT + halfScreenWidth + 'px';
  activeSpaceElem.style.top = -constants.OFFSET_TOP + halfScreenHeight + 'px';

}

function renderSpaces(){

  var resultHtml = '';
  var container = document.querySelector('.zoom-wrap');

  var spaces = dataService.getSpaces();

  spaces.forEach(function(space, index){

    var isActive = space.active ? 'active' : ''

    var spaceHtml = '<div class="space ' + isActive + ' space-'+index+'"' +
    'style="left: -25000px; top: -25000px;"' + 
    '>';

    spaceHtml = spaceHtml + '<div class="space-content"></div>';

    spaceHtml = spaceHtml + '<div class="axis-y"></div>';
    spaceHtml = spaceHtml + '<div class="axis-x"></div>';

    spaceHtml = spaceHtml + '</div>';

    resultHtml = resultHtml + spaceHtml;


  })


  container.innerHTML = resultHtml;

  // eventService.dispatchEvent(EVENTS.RENDER_CARDS);
  // eventService.dispatchEvent(EVENTS.RENDER_TITLES);

  
}

function initSpace() {

  return new Promise(function(resolve, reject) {

    var activeProject = localStorage.getItem('activeProject');

    fetch('/api/get-project?name=' + activeProject).then(function(data){
      return data.json()
    }).then(function(data){

      var spaces = data.spaces

      spaces.forEach(function(space){
        space.active = false;
      })

      spaces[0].active = true;

      dataService.setProject(data);
      dataService.setSpaces(spaces)

      renderSpaces();

      activeSpaceElem = document.querySelector('.space');
      activeSpace = spaces[0]

      console.log('fetch spaces', spaces)

      dataService.setActiveSpace(spaces[0])
      dataService.setActiveSpaceElem(activeSpaceElem)

      resolve()

    }).catch(function(error){

       console.log("Saved Filed not Found. Move to Index")

      location.href = '/';

    })

  })

}

function initEventListeners(){

  eventService.addEventListener(EVENTS.RENDER_SPACES, function(){
    renderSpaces();
  })

}

function fixDataStructure(){

  spaces = dataService.getSpaces();

  spaces = spaces.map(function(space){

    if (!space.hasOwnProperty('cards')) {
      space.cards = []
    }

    if (!space.hasOwnProperty('titles')) {
      space.titles = []
    }

    if (!space.hasOwnProperty('images')) {
      space.images = []
    }

    return space

  })

  dataService.setSpaces(spaces);


}

function init(){

  var activeProject = localStorage.getItem('activeProject');

  if (activeProject) {

    dataService = DataService();
    eventService = EventService();

    constants = dataService.getConstants();

    initSpace().then(function(){

      initEventListeners()

      var intefaceModule = InterfaceModule(dataService, eventService)
      var cardsModule = CardsModule(dataService, eventService)
      var titlesModule = TitlesModule(dataService, eventService)
      var imagesModule = ImagesModule(dataService, eventService)

      intefaceModule.init()
      cardsModule.init()
      titlesModule.init()
      imagesModule.init()

      initGlobalDragListener();
      initGlobalZoomListener();
      setSpaceToCenter();

      fixDataStructure()
      
      dataService.clearActiveFromCards();

      eventService.dispatchEvent(EVENTS.RENDER_CARDS);
      eventService.dispatchEvent(EVENTS.RENDER_TITLES);
      eventService.dispatchEvent(EVENTS.RENDER_IMAGES);

      var hash = window.location.hash.split('#/')[1]

      if(!hash) {
        hash = '';
      }

      handleHashUrl(dataService, eventService, hash)

    })

  } else {

    location.href = '/';

  }
  
}

function handleHashUrl(dataService, eventService, hash) {

  console.log("hash change event ", hash);

  var pieces = hash.split('&')

  pieces.forEach(function(piece) {

    var parts = piece.split('=')
    var key = parts[0]
    var value = decodeURI(parts[1]);

    console.log('key', key);
    console.log('value', value);

    if (key === 'goto' && value) {

      var resultCard;

      if (value.indexOf('/') !== -1) {

        console.log("lookup in specific space");

        var valuePieces = value.split('/');
        var spaceName = valuePieces[0];
        var cardName = valuePieces[1];

        var spaces = dataService.getSpaces();
        var activeSpaceIndex;
        var newActiveSpace;

        spaces.forEach(function(space){
          space.active = false;
        })

        spaces.forEach(function(space, index){
          if(space.name.toLocaleLowerCase() == spaceName.toLocaleLowerCase()){
            newActiveSpace = space;
            activeSpaceIndex = index
          }
        })

        if (newActiveSpace) {

          console.log('newActiveSpace', newActiveSpace);

          activeSpace = newActiveSpace

          activeSpace.active = true;
          
          dataService.setActiveSpace(activeSpace);
        

          activeSpace.cards.forEach(function(card){

            if (card.title.toLocaleLowerCase() == cardName.toLocaleLowerCase()) {
                resultCard = card;
            }

          })

          eventService.dispatchEvent(EVENTS.RENDER_SPACES);

          activeSpaceElem = document.querySelector('.space-' + activeSpaceIndex)
          dataService.setActiveSpaceElem(activeSpaceElem);

          eventService.dispatchEvent(EVENTS.RENDER_SPACES_TABS);

          eventService.dispatchEvent(EVENTS.RENDER_CARDS);
          eventService.dispatchEvent(EVENTS.RENDER_TITLES);
          eventService.dispatchEvent(EVENTS.RENDER_IMAGES);

        }

      } else {

        console.log("lookup in active space");

        activeSpace = dataService.getActiveSpace();

        console.log('activeSpace.cards', activeSpace.cards);

        activeSpace.cards.forEach(function(card){

          if (card.title.toLocaleLowerCase() == value.toLocaleLowerCase()) {
              resultCard = card;
          }

        })

      }

      if (resultCard) {

        var startLeft = parseInt(activeSpaceElem.style.left.split('px')[0], 10);
        var startTop = parseInt(activeSpaceElem.style.top.split('px')[0], 10);

        var startLeft = -constants.OFFSET_LEFT
        var startTop = -constants.OFFSET_TOP

        var diffLeft = constants.OFFSET_LEFT - resultCard.position.x
        var diffTop = constants.OFFSET_TOP - resultCard.position.y

        var halfScreenWidth = document.body.clientWidth / 2;
        var halfScreenHeight = document.body.clientHeight / 2;

        var halfCardHeight = resultCard.style.height / 2;
        var halfCardWidth  = resultCard.style.width / 2;

        activeSpaceElem.style.left = startLeft + diffLeft + halfScreenWidth - halfCardWidth + 'px';
        activeSpaceElem.style.top = startTop + diffTop + halfScreenHeight - halfCardHeight + 'px';

        dataService.clearActiveFromCards();

        resultCard.active = true;

        dataService.setCardById(resultCard.id, resultCard);

        eventService.dispatchEvent(EVENTS.RENDER_CARDS);

      } else {

        toastr.error('Такой карточки не существует')

      }

   
      console.log('resultCard', resultCard);

    }


  })

}

window.onhashchange = function(event){

  var hashUrl = event.newURL.split('#/')[1]

  handleHashUrl(dataService, eventService, hashUrl)
  

  eventService.dispatchEvent(EVENTS.CLEAR_SEARCH_AUTOCOMPLETE)
      
}


init();