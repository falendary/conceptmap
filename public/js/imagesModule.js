function ImagesModule(dataService, eventService) {

	function render(){

		var activeSpace = dataService.getActiveSpace();

		var resultHtml = ''
	  	var itemHtml = '';

	  	var activeSpaceElem = dataService.getActiveSpaceElem();

	  	console.log('ImagesModule render activeSpace', activeSpace);
	  	console.log('ImagesModule  render activeSpaceElem', activeSpaceElem);

		if (activeSpace.images) {

		    activeSpace.images.forEach(function(item){

		      itemHtml = '<div class="image" ' + 
		      'data-id="'+ item.id + '" '+
		      'style="'+
		      'left: ' + item.position.x + 'px;'+
		      'top: ' + item.position.y + 'px;'+
		      'width: ' + item.style.width + 'px;'+
		      'height: ' + item.style.height + 'px;'+
		      '" >';

		      itemHtml = itemHtml + '<div class="image-content">'
		      itemHtml = itemHtml + '<div class="draggable-corner" title="Переместить"></div>';
		      itemHtml = itemHtml + '<div class="delete-corner" title="Удалить"></div>';
		      itemHtml = itemHtml + '<div class="resize-corner" title="Растянуть"></div>';
		      itemHtml = itemHtml + '<label for="img-input-' + item.id + '" class="edit-corner" title="Изменить"></label>';
		      itemHtml = itemHtml + '<input class="image-file-input" id="img-input-' + item.id + '" type="file">';

		      if (item.source) {
		      	itemHtml = itemHtml + '<img src="' + item.source + '">';
			  } else {
			  	itemHtml = itemHtml + '<div class="no-image "><i class="fa fa-picture-o" aria-hidden="true"></i></div>';
			  }

		      itemHtml = itemHtml + '</div>'
		      itemHtml = itemHtml + '</div>'

		      resultHtml = resultHtml + itemHtml;


		    })

		}

		var container = activeSpaceElem.querySelector('.space-content').querySelector('.images-container');

		if(!container) {

			var elem = document.createElement('div')
			elem.classList.add('images-container')
			activeSpaceElem.querySelector('.space-content').appendChild(elem)

			container = activeSpaceElem.querySelector('.space-content').querySelector('.images-container');
		}

		container.innerHTML = resultHtml

		setItemsEventListeners(activeSpaceElem);

	}

	function setItemDraggableListener(elem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var currentY;
	  var currentX;

	  var resultY;
	  var resultX;

	  var mousePressed = false;

	  var id = elem.dataset.id
	  var item = dataService.getImageById(id);

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

	      resultY = currentY + lastY - startY
	      resultX = currentX + lastX - startX

	      item.position.x = resultX;
	      item.position.y = resultY;

	      elem.style.top = resultY  + 'px';
	      elem.style.left =   resultX + 'px';

	     
	    }

	  })

	}

	function setItemResizeListener(elem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var resultHeight;
	  var resultWidth;

	  var mousePressed = false;

	  var id = elem.dataset.id
	  var item = dataService.getImageById(id);

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

	      if (resultWidth > 100) {

		      item.style.width = resultWidth;
		      elem.style.width = resultWidth + 'px';
		      item.style.height = resultWidth;
	      	  elem.style.height =  resultWidth + 'px';
		      
	      } else {

 			  item.style.width = 100;
		      elem.style.width = '100px';
		      item.style.height = 100;
	          elem.style.height =  '100px';

	      }

	     
	    }

	  })

	}

	function setItemDeleteListener(elem) {

	  var id = elem.dataset.id
	  var item = dataService.getImageById(id);

	  elem.addEventListener('click', function(event) {

	  	if (event.target.classList.contains('delete-corner')){

	  		dataService.deleteImageById(id);

	  		eventService.dispatchEvent(EVENTS.RENDER_IMAGES);
	  	}

	  })

	}

	function setItemFileInputChangeListener(elem) {

	  var id = elem.dataset.id
	  var item = dataService.getImageById(id);

	  var input = elem.querySelector('.image-file-input')

	  input.addEventListener('change', function(event) {

	  	console.log('file change', event);

	  	var formData = new FormData();

	  	formData.append('image', input.files[0])
	  	formData.append('spaceId', activeSpace.id)

	  	fetch('/api/upload', {
	  		method: "POST",
	  		body: formData
	  	}).then(function(data){
	  		return data.json()
	  	}).then(function(data){

	  		item.source = data.source

	  		dataService.setImageById(item.id, item);

	  		eventService.dispatchEvent(EVENTS.RENDER_IMAGES);

	  	})

	  })

	}

	function setItemsEventListeners(spaceElem){

	  var elements = spaceElem.querySelectorAll('.image');

	  var i;

	  elements.forEach(function(elem) {

	    setItemDraggableListener(elem);
	    setItemResizeListener(elem);
	    setItemDeleteListener(elem);
	    setItemFileInputChangeListener(elem);
	
	  })

	}

	function setEventListeners(){

		eventService.addEventListener(EVENTS.RENDER_IMAGES, function(){

			render();

		})

	}

	function init(){

		setEventListeners();

	}

	return {
		init: init
	}

}