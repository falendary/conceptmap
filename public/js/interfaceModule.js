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
      }).catch(function(error){
        toastr.error('Ошибка', error)
        console.log('error', error);

        exportProjectToFile();

      })

  }

  function exportProjectToFile(){

    var body = dataService.getProject();

    body.spaces = dataService.getSpaces()

    var date = new Date().toISOString().split('T')[0]

    downloadFile(JSON.stringify(body), 'application/json', 'Concept Map ' + date + '.json')


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
  
        eventService.dispatchEvent(EVENTS.RENDER_CARDS);
        eventService.dispatchEvent(EVENTS.RENDER_TITLES);

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

  function goTo(link) {

    window.location.hash = '#/';

    setTimeout(function(){

      window.location.hash = '#/goto=' + link;
      
    }, 0)

  }

  function handleSearchBox() {

    document.querySelector('.search-box-button').addEventListener('click', function(event) {

      var input = document.querySelector('.search-box-input');

      var spaceName = activeSpace.name

      var link = spaceName + '/' + input.value

      goTo(link)

      input.value = '';
      

    })

    document.querySelector('.search-box-input').addEventListener('keydown', function(event){

      if (event.keyCode == 13) {

        var input = document.querySelector('.search-box-input');

        var spaceName = activeSpace.name

        var link = spaceName + '/' + input.value

        goTo(link)

        input.value = '';

      }

    })

  }

  function init(){

    setEventListeners();

    activeSpace = dataService.getActiveSpace();
    activeSpaceElem = dataService.getActiveSpaceElem();

    constants = dataService.getConstants();

    console.log('interface activeSpaceElem', activeSpaceElem);

    userPositionElem = document.querySelector('.user-position')
    userPositionElem.innerHTML = 'X:'+ 1000 + ' Y:' + 1000;

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
          y: constants.OFFSET_TOP + diffTop + halfScreenHeight - 16
        },
        style: {
          width: 180,
          height: 32
        },
        text: 'Hello there'
      })

      console.log('Title added', activeSpace);

      eventService.dispatchEvent(EVENTS.RENDER_TITLES)

    })

    document.querySelector('.add-image-button').addEventListener('click', function(event){

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      var diffLeft = -constants.OFFSET_LEFT - left;
      var diffTop = -constants.OFFSET_TOP - top;

      console.log('diffLeft', diffLeft);
      console.log('diffTop', diffTop);

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      activeSpace.images.push({
        spaceId: activeSpace.id,
        id: toMD5('image_' + new Date()),
        position: {
          x: constants.OFFSET_LEFT + diffLeft + halfScreenWidth - 50,
          y: constants.OFFSET_TOP + diffTop + halfScreenHeight - 50
        },
        style: {
          width: 100,
          height: 100
        },
        source: null
      })

      console.log('Image added', activeSpace);

      eventService.dispatchEvent(EVENTS.RENDER_IMAGES)

    })

    document.querySelector('.export-button').addEventListener('click', function(event) {

      exportProjectToFile()

    })

    document.body.addEventListener('mousemove', function(event) {

      var left = parseInt(activeSpaceElem.style.left.split("px")[0], 10);
      var top = parseInt(activeSpaceElem.style.top.split("px")[0], 10);

      var valueX = 0;
      var valueY = 0;

      valueX = (-(left + constants.OFFSET_LEFT - event.clientX))
      valueY = (top + constants.OFFSET_TOP - event.clientY)

      userPositionElem.innerHTML = 'X:'+ valueX + ' Y:' + valueY;

    })

    handleSearchBox();


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

    window.addEventListener('beforeunload', (event) => {
       
      console.log('beforeunload event', event);

      saveProject();

    });


    document.body.addEventListener('keydown', function(event){

       if (event.keyCode == 9){

          event.preventDefault();

          var elem = document.querySelector('.search-box-input');
          elem.focus()
       }




    })


    console.log("Interface ready");

    renderSpacesTabs();

  }

  return {
    init: init
  }

}