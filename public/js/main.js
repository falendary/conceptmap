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

      activeSpaceElem.style.top = currentY + lastY - startY + 'px';
      activeSpaceElem.style.left =  currentX + lastX - startX + 'px';

    }


  })

}

function initGlobalZoomListener(){

   $("body").on("mousewheel DOMMouseScroll", function (e) {

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

  eventService.dispatchEvent(EVENTS.RENDER_CARDS);

  
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

      // var space = {
      //   id: toMD5('space_' + new Date())
      // }

      // var spaces = [];

      // spaces.push(space)
      // activeSpaceElem = document.querySelector('.space');
      // activeSpace = space

      // dataService.setSpaces(spaces)
      // dataService.setActiveSpace(space)
      // dataService.setActiveSpaceElem(activeSpaceElem)

      // resolve()

    })

  })

}

function initEventListeners(){

  eventService.addEventListener(EVENTS.RENDER_SPACES, function(){
    renderSpaces();
  })

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

      intefaceModule.init()
      cardsModule.init()

      initGlobalDragListener();
      initGlobalZoomListener();
      setSpaceToCenter();
      
      eventService.dispatchEvent(EVENTS.RENDER_CARDS);

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

      activeSpace.cards.forEach(function(card){

        if (card.title.toLocaleLowerCase() == value.toLocaleLowerCase()) {
            resultCard = card;
        }

      })

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

      }

      console.log('resultCard', resultCard);

    }


  })

}

window.onhashchange = function(event){

  var hashUrl = event.newURL.split('#/')[1]

  handleHashUrl(dataService, eventService, hashUrl)
      
}


init();