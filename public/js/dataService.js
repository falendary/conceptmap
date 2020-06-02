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

    for(var i = 0; i < state.activeSpace.cards.length; i = i + 1) {

      if (id == state.activeSpace.cards[i].id) {
        result = state.activeSpace.cards[i];
        break;
      } 

    }

    return result;

  }

  function deleteCardById(id) {

    for(var i = 0; i < state.activeSpace.cards.length; i = i + 1) {

      if (id == state.activeSpace.cards[i].id) {
        
        state.activeSpace.cards.splice(i, 1)

        break;

      } 

    }

  }

  function setCardById(id, card) {

    for(var i = 0; i < state.activeSpace.cards.length; i = i + 1) {

      if (id == state.activeSpace.cards[i].id) {
        
        state.activeSpace.cards.splice(i, 1)
        state.activeSpace.cards.push(Object.assign({}, card))

        break;

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

    for(var i = 0; i < state.activeSpace.titles.length; i = i + 1) {

      if (id == state.activeSpace.titles[i].id) {
        result = state.activeSpace.titles[i];
        break;
      } 

    }

    return result;

  }

  function deleteTitleById(id) {

    for(var i = 0; i < state.activeSpace.titles.length; i = i + 1) {

      if (id == state.activeSpace.titles[i].id) {
        
        state.activeSpace.titles.splice(i, 1)

        break;

      } 

    }

  }

  function setTitleById(id, card) {

    for(var i = 0; i < state.activeSpace.titles.length; i = i + 1) {

      if (id == state.activeSpace.titles[i].id) {
        
        state.activeSpace.titles.splice(i, 1)
        state.activeSpace.titles.push(Object.assign({}, card))

        break;

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
    setTitleById: setTitleById

  }

}