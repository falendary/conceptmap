function DataService() {

  state = {
    project: null,
    spaces: [],
    activeSpace: null,
    scale: 1
  }

  function getConstants(){

    return {
      OFFSET_LEFT: 25000,
      OFFSET_TOP: 25000
    }

  }

  function setProject(project) {
    state.project = project;
  }

  function getProject(){
    return state.project;
  }

  function setActiveSpace(space){
    state.activeSpace = space
  }

  function getActiveSpace() {
    return state.activeSpace
  }

  function setActiveSpaceElem(spaceElem) {
    state.activeSpaceElem = spaceElem;
  }

  function getActiveSpaceElem(spaceElem) {
    return state.activeSpaceElem;
  }

  function setSpaces(spaces) {
    state.spaces = spaces
  }

  function getSpaces(){
    return state.spaces
  }

  function getCardById(id) {

    var result = null;

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.cards.length; x = x + 1) {

        var card = space.cards[x]

        if (id == card.id) {
          
           result = card;

           break;
        } 

      }

    }

    return result;

  }

  function deleteCardById(id) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.cards.length; x = x + 1) {

        var card = space.cards[x]

        if (id == card.id) {

          space.cards.splice(x, 1)
          break;

        } 

      }

    }


  }

  function setCardById(id, data) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.cards.length; x = x + 1) {

        var card = space.cards[x]

        if (id == card.id) {
          
          space.cards.splice(x, 1)
          space.cards.push(Object.assign({}, data))

          break;

        } 

      }

    }

  }

  function setCurrentScale(scale){
    state.scale = scale;
  }

  function getCurrentScale() {
    return state.scale;
  }

  function getTitleById(id) {

    var result = null;

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.titles.length; x = x + 1) {

        var title = space.titles[x];

        if (id == title.id) {
          
          result = title;

          break;

        } 

      }

    }

    return result;

  }

  function deleteTitleById(id) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.titles.length; x = x + 1) {

        var title = space.titles[x];

        if (id == title.id) {
          
          space.titles.splice(x, 1);

          break;

        } 

      }

    }

  }

  function setTitleById(id, data) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.titles.length; x = x + 1) {

        var title = space.titles[x];

        if (id == title.id) {
          
          space.titles.splice(x, 1);
          space.titles.push(Object.assign({}, data));

          break;

        } 

      }

    }

  }

  function getImageById(id) {

    var result = null;

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.images.length; x = x + 1) {

        var image = space.images[x];

        if (id == image.id) {
          
          result = image;

          break;

        } 

      }

    }

    return result;

  }

  function deleteImageById(id) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.images.length; x = x + 1) {

        var image = space.images[x];

        if (id == image.id) {
          
          space.images.splice(x, 1);

          break;

        } 

      }

    }

  }

  function setImageById(id, data) {

    for (var i = 0; i < state.spaces.length; i = i + 1) {

      var space = state.spaces[i];

      for(var x = 0; x < space.images.length; x = x + 1) {

        var image = space.images[x];

        if (id == image.id) {
          
          space.images.splice(x, 1);
          space.images.push(Object.assign({}, data));

          break;

        } 

      }

    }

  }

  return {

    getConstants: getConstants,

    setProject: setProject,
    getProject: getProject,

    setSpaces: setSpaces,
    getSpaces: getSpaces,

    setActiveSpace: setActiveSpace,
    getActiveSpace: getActiveSpace,

    setActiveSpaceElem: setActiveSpaceElem,
    getActiveSpaceElem: getActiveSpaceElem,

    getCardById: getCardById,
    setCardById: setCardById,
    deleteCardById: deleteCardById,

    setCurrentScale: setCurrentScale,
    getCurrentScale: getCurrentScale,

    getTitleById: getTitleById,
    deleteTitleById: deleteTitleById,
    setTitleById: setTitleById,

    getImageById: getImageById,
    deleteImageById: deleteImageById,
    setImageById: setImageById

  }

}