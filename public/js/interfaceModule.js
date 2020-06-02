function InterfaceModule(dataService, eventService) {

  var userPositionElem;
  var activeSpace;
  var activeSpaceElem;
  var constants;

  function saveProject(){

      var body = dataService.getProject();

      body.spaces = dataService.getSpaces()

      fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(function(data){
          toastr.info('Сохранено')
      })

  }

  function setEventListeners(){

    eventService.addEventListener(EVENTS.RENDER_SPACES_TABS, function(){

      renderSpacesTabs();

    })

    eventService.addEventListener(EVENTS.SAVE_PROJECT, function(){

      saveProject();

    })


  }

  function handleSpaceTabs() {

    var buttons = document.querySelectorAll('.space-button');
    var spaces = dataService.getSpaces();

    for( var i = 0; i < buttons.length; i = i + 1) {

      var button = buttons[i];

      button.addEventListener('click', function(event){

        var index = this.dataset.index

        console.log("Change space index", index);

        spaces.forEach(function(space){
          space.active = false;
        })

        activeSpace = spaces[index]
        activeSpace.active = true;
        dataService.setActiveSpace(activeSpace);

        eventService.dispatchEvent(EVENTS.RENDER_SPACES);

        activeSpaceElem = document.querySelector('.space-' + index);

        dataService.setActiveSpaceElem(activeSpaceElem);

        renderSpacesTabs();

        setTimeout(function(){

          document.querySelector('.to-center-button').click();

        }, 10)

      })

    }

  }

  function renderSpacesTabs(){

    var spacesContainerElem = document.querySelector('.spaces-container');

    var spaces = dataService.getSpaces();

    console.log("renderSpaces spaces", spaces);

    var resultHtml = ''

    spaces.forEach(function(space, index) {

      var isActive = space.active ? 'active' : '';

      var spaceHtml = '<div data-index="' + index + '" class="space-button ' + isActive + ' ">';

      spaceHtml = spaceHtml + space.name;

      spaceHtml = spaceHtml + "</div>";

      resultHtml = resultHtml + spaceHtml;

    })

    spacesContainerElem.innerHTML = resultHtml;

    handleSpaceTabs()

  }

  function init(){

    setEventListeners();

    activeSpace = dataService.getActiveSpace();
    activeSpaceElem = dataService.getActiveSpaceElem();

    constants = dataService.getConstants();

    console.log('interface activeSpaceElem', activeSpaceElem);

    userPositionElem = document.querySelector('.user-position')

    document.querySelector('.to-center-button').addEventListener('click', function(event){

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      console.log('halfScreenWidth', halfScreenWidth);
      console.log('halfScreenHeight', halfScreenHeight);

      activeSpaceElem.style.left = -constants.OFFSET_LEFT + halfScreenWidth + 'px';
      activeSpaceElem.style.top = -constants.OFFSET_TOP + halfScreenHeight + 'px';

      window.location.hash = '#/'

    })

    document.querySelector('.add-card-button').addEventListener('click', function(event){

      if(!activeSpace.cards) {
        activeSpace.cards = []
      }

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      var diffLeft = -constants.OFFSET_LEFT - left;
      var diffTop = -constants.OFFSET_TOP - top;

      console.log('diffLeft', diffLeft);
      console.log('diffTop', diffTop);

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

        saveProject();

    })

    document.querySelector('.add-title-button').addEventListener('click', function(event){

      if(!activeSpace.titles) {
        activeSpace.titles = []
      }

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      var diffLeft = -constants.OFFSET_LEFT - left;
      var diffTop = -constants.OFFSET_TOP - top;

      console.log('diffLeft', diffLeft);
      console.log('diffTop', diffTop);

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      activeSpace.titles.push({
        spaceId: activeSpace.id,
        id: toMD5('title_' + new Date()),
        position: {
          x: constants.OFFSET_LEFT + diffLeft + halfScreenWidth - 90,
          y: constants.OFFSET_TOP + diffTop + halfScreenHeight - 120
        },
        style: {
          width: 180,
          height: 32
        },
        title: 'Hello there'
      })

      console.log('Card added', activeSpace);

      eventService.dispatchEvent(EVENTS.RENDER_TITLES)

    })

    document.querySelector('.export-button').addEventListener('click', function(event) {

      var body = dataService.getProject();

      body.spaces = dataService.getSpaces()

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

      var spaceName = activeSpace.name

      setTimeout(function(){

        window.location.hash = '#/goto=' + spaceName + '/' + input.value;
        input.value = '';

      }, 0)

    })

    document.querySelector('.reset-zoom-button').addEventListener('click', function(event){

      $(".zoom-wrap")
        .css("transform-origin", "inital")
        .css("transform", "scale(1)");

    })

    document.querySelector('.to-main-menu').addEventListener('click', function(event){

      localStorage.removeItem('activeProject');

      location.href = '/';


    })

    document.querySelector('.add-space-button').addEventListener('click', function(event){

      var spaceName = document.querySelector('.space-name-input').value;

      var spaces = dataService.getSpaces();

      spaces.forEach(function(space){
        space.active = false;
      })

      var space = {
        name: spaceName,
        active: true,
        id: toMD5('space_' + new Date()),
        cards: []
      }

      spaces.push(space)

      console.log('spaces', spaces);

      dataService.setSpaces(spaces);
      dataService.setActiveSpace(space);

      activeSpace = space;

      document.querySelector('.space-name-input').value = '';

      renderSpacesTabs();

      eventService.dispatchEvent(EVENTS.RENDER_SPACES);

      activeSpaceElem = document.querySelector('.space.active');

      dataService.setActiveSpaceElem(activeSpaceElem)

    })

    console.log("Interface ready");

    renderSpacesTabs();

  }

  return {
    init: init
  }

}