function TitlesModule(dataService, eventService) {

	function renderTitles(){

		var activeSpace = dataService.getActiveSpace();

		var resultHtml = ''
	  	var itemHtml = '';

	  	var activeSpaceElem = dataService.getActiveSpaceElem();

		if (activeSpace.titles) {

		    activeSpace.titles.forEach(function(item){

		      itemHtml = '<div class="title" ' + 
		      'data-id="'+ item.id + '" '+
		      'style="'+
		      'left: ' + item.position.x + 'px;'+
		      'top: ' + item.position.y + 'px;'+
		      'width: ' + item.style.width + 'px;'+
		      'height: ' + item.style.height + 'px;'+
		      '" >';

		      itemHtml = itemHtml + '<div class="title-content">'
		      itemHtml = itemHtml + '<div class="draggable-corner" title="Переместить"></div>';
		      itemHtml = itemHtml + '<div class="delete-corner" title="Удалить"></div>';
		      itemHtml = itemHtml + '<div class="resize-corner" title="Растянуть"></div>';

		      itemHtml = itemHtml + '<textarea class="title-text">' + item.text + '</textarea>';


		      itemHtml = itemHtml + '</div>'
		      itemHtml = itemHtml + '</div>'

		      resultHtml = resultHtml + itemHtml;

		    })

		}

		var container = activeSpaceElem.querySelector('.space-content').querySelector('.titles-container');

		if(!container) {
			var elem = document.createElement('div')
			elem.classList.add('titles-container')
			activeSpaceElem.querySelector('.space-content').appendChild(elem)

			container = activeSpaceElem.querySelector('.space-content').querySelector('.titles-container');
		}

		container.innerHTML = resultHtml

		setTitlesEventListeners(activeSpaceElem);


	}

	function setTitleDraggableListener(elem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var currentY;
	  var currentX;

	  var resultY;
	  var resultX;

	  var diffTop;
	  var diffLeft;

	  var mousePressed = false;

	  var titleId = elem.dataset.id
	  var title = dataService.getTitleById(titleId);

	  elem.addEventListener('mousedown', function(event){

	    // console.log('card mousedown event', event);

	    if (event.target.classList.contains('draggable-corner')) {

	      startX = event.clientX;
	      startY = event.clientY;

	      currentY = parseInt(elem.style.top.split('px')[0], 10);
      	  currentX = parseInt(elem.style.left.split('px')[0], 10);

	      mousePressed = true;

	    }

	  })

	  document.body.addEventListener('mouseup', function(event) {

	    // console.log('mouseup event', event);

	    mousePressed = false;

	  })

	  document.body.addEventListener('mousemove', function(event) {

	  	// console.log('mousePressed', mousePressed);

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

	      diffTop = lastY - startY;
          diffLeft = lastX - startX;

	      resultY = currentY + diffTop / currentScale;
	      resultX = currentX + diffLeft / currentScale;

	      title.position.x = resultX;
	      title.position.y = resultY;

	      elem.style.top = resultY  + 'px';
	      elem.style.left =   resultX + 'px';

	     
	    }

	  })

	}

	function setTitleResizeListener(elem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var resultHeight;
	  var resultWidth;

	  var mousePressed = false;

	  var titleId = elem.dataset.id
	  var title = dataService.getTitleById(titleId);

	  var currentWidth;
	  var currentHeight;

	  elem.addEventListener('mousedown', function(event){

	    // console.log('card mousedown event', event);

	    if (event.target.classList.contains('resize-corner')) {

	      startX = event.clientX;
	      startY = event.clientY;

      	  currentWidth = parseInt(elem.style.width.split('px')[0])
	  	  currentHeight = parseInt(elem.style.height.split('px')[0])

	      mousePressed = true;

	    }

	  })

	  document.body.addEventListener('mouseup', function(event) {

	    // console.log('mouseup event', event);

	    mousePressed = false;

	  })

	  document.body.addEventListener('mousemove', function(event) {

	  	// console.log('mousePressed', mousePressed);

	    if (mousePressed) {

	      // console.log('mousemove event', event);

	      lastX = event.clientX;
	      lastY = event.clientY;

	      resultWidth = currentWidth + lastX - startX 
	      resultHeight = currentHeight + lastY - startY

	      if (resultWidth > 180) {

		      title.style.width = resultWidth;
		      elem.style.width = resultWidth + 'px';
		      
	      } else {

 			  title.style.width = 180;
		      elem.style.width = '180px';

	      }

	      if (resultHeight > 32) {

	      	title.style.height = resultHeight;
	      	elem.style.height =  resultHeight + 'px';

	      } else {
	      	title.style.height = 32;
	      	elem.style.height =  '32px';
	      }

	     
	    }

	  })

	}

	function setTitleDeleteListener(elem) {

	  var titleId = elem.dataset.id
	  var title = dataService.getTitleById(titleId);

	  elem.addEventListener('click', function(event) {

	  	if (event.target.classList.contains('delete-corner')){

	  		dataService.deleteTitleById(titleId);

	  		eventService.dispatchEvent(EVENTS.RENDER_TITLES);
	  	}

	  })

	}

	function setTitleValueChangeListener(elem) {

	  var titleId = elem.dataset.id
	  var title = dataService.getTitleById(titleId);

	  elem.querySelector('.title-text').addEventListener('focus', function(event){
	  	activeSpace = dataService.getActiveSpace();
	  })

	  elem.querySelector('.title-text').addEventListener('change', function(event) {

	  	title.text = this.value;

	  	if(!title.text) {
	  		elem.classList.add('empty-title')
	  	} else {
	  		elem.classList.remove('empty-title')
	  	}

	  	dataService.setTitleById(titleId, title);

	  })

	}

	function setTitlesEventListeners(spaceElem){

	  var elements = spaceElem.querySelectorAll('.title');

	  elements.forEach(function(elem) {

	    setTitleDraggableListener(elem);
	    setTitleDeleteListener(elem);
	    setTitleValueChangeListener(elem);
	    setTitleResizeListener(elem);

	  })

	}

	function setEventListeners(){

		eventService.addEventListener(EVENTS.RENDER_TITLES, function(){

			renderTitles();

		})

	}

	function init(){

		setEventListeners();

	}

	return {
		init: init
	}

}