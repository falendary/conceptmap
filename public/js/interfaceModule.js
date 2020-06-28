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

    eventService.addEventListener(EVENTS.CLEAR_SEARCH_AUTOCOMPLETE, function(){

      clearSearchBoxAutocomplete()

    })


    eventService.addEventListener(EVENTS.SCALE_CHANGE, function(){

      var currentScale = dataService.getCurrentScale()

      document.querySelector('.reset-zoom-button .scale').innerHTML = Math.floor(currentScale * 100) + '%';

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
        eventService.dispatchEvent(EVENTS.RENDER_IMAGES);

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

  function clearSearchBoxAutocomplete() {

    var searchBoxAutocomplete = document.querySelector('.search-box-autocomplete');
    var searchBoxInput = document.querySelector('.search-box-input');

    searchBoxInput.blur();
    // searchBoxInput.value = '';
    searchBoxAutocomplete.classList.remove('active');
    searchBoxAutocomplete.innerHTML = '';

  }

  function drawSearchboxAutocomplete(searchBoxAutocomplete, searchBoxInput) {

    console.log("Redraw autocomplete")


    var resultHtml = '';
    var activeSpace = dataService.getActiveSpace();

    var spaces = dataService.getSpaces();
    var spacesLength = spaces.length;
    var space;
    var card;
    var cardsLength;
    var i, x;

    var userInput = searchBoxInput.value;

    var matches = [];
    var limit = 5;

    console.log('userInput', userInput);

    if (userInput) {
      for (i =0; i < spacesLength; i = i + 1) {

        space = spaces[i];

        cardsLength = space.cards.length;

        for (x = 0; x < cardsLength; x = x + 1) {

          card = space.cards[x];


          if (card.title.toLowerCase().indexOf(userInput.toLowerCase()) !== -1) {

            matches.push({

              space: space,
              card: card

            });

          }

          if (matches.length >= limit) {
            break;
          }


        }

        if (matches.length >= limit) {
          break;
        }

      }
    }

    console.log('matches', matches);

    if (matches.length) {

      if(!searchBoxAutocomplete.classList.contains('active')) {
        searchBoxAutocomplete.classList.add('active');
      }

    

    var rowHtml;

    for (i = 0; i < matches.length; i = i + 1) {

      space = matches[i].space;
      card = matches[i].card;

      if (activeSpace.name == space.name) {

        rowHtml = '<a class="search-box-option" href="map.html#/goto=' + card.title + '">';

        rowHtml = rowHtml + card.title;

      } else {

        rowHtml = '<a class="search-box-option" href="map.html#/goto=' + space.name + '/' + card.title + '">';

        rowHtml = rowHtml + '<span class="search-box-space-name">' + space.name +'</span> / ' + card.title;

      }

      rowHtml = rowHtml + '</a>';

      resultHtml = resultHtml + rowHtml

    }


    searchBoxAutocomplete.innerHTML = resultHtml

    } else {

      searchBoxAutocomplete.classList.remove('active');
      searchBoxAutocomplete.innerHTML = '';

    }

  }

  function handleSearchBox() {

    var searchBoxContainer = document.querySelector('.search-box');
    var searchBoxInput = document.querySelector('.search-box-input');
    var searchBoxButton = document.querySelector('.search-box-button');
    var searchBoxAutocomplete = document.querySelector('.search-box-autocomplete');

    searchBoxButton.addEventListener('click', function(event) {

      var input = document.querySelector('.search-box-input');

      var spaceName = activeSpace.name

      var link = spaceName + '/' + input.value

      goTo(link)

      input.value = '';
      

    })

    searchBoxInput.addEventListener('keydown', function(event){

      if (event.keyCode == 13) {

        if (searchBoxInput.value && searchBoxInput.value.length) {
        
          goTo(searchBoxInput.value);

        }

        // searchBoxInput.value = '';

      }

      if (event.keyCode == 9) {

        var options = document.querySelectorAll('.search-box-option');

        if (options.length) {

          searchBoxInput.value = decodeURI(options[0].href.split('goto=')[1]);

        }

      }

    })

    searchBoxInput.addEventListener('keyup', function(event) {

       drawSearchboxAutocomplete(searchBoxAutocomplete, searchBoxInput)

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

      activeSpaceElem = dataService.getActiveSpaceElem();

      var halfScreenWidth = document.body.clientWidth / 2;
      var halfScreenHeight = document.body.clientHeight / 2;

      console.log('halfScreenWidth', halfScreenWidth);
      console.log('halfScreenHeight', halfScreenHeight);

      activeSpaceElem.style.left = -constants.OFFSET_LEFT + halfScreenWidth + 'px';
      activeSpaceElem.style.top = -constants.OFFSET_TOP + halfScreenHeight + 'px';

      console.log('to center left '  + activeSpaceElem.style.left)
      console.log('to center top ' + activeSpaceElem.style.top)

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

      dataService.setCurrentScale(1);

      eventService.dispatchEvent(EVENTS.SCALE_CHANGE)

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

    document.body.addEventListener('click', function(event){

      if (event.target.classList.contains('space-content')) {

        dataService.clearActiveFromCards();
        eventService.dispatchEvent(EVENTS.RENDER_CARDS);

      }
      
    })

    document.body.addEventListener('keydown', function(event){

      if((event.ctrlKey || event.metaKey) && event.which == 83) {
            // Save Function
            event.preventDefault();
            saveProject();

        }
    
    })


    console.log("Interface ready");

    renderSpacesTabs();

  }

  return {
    init: init
  }

}