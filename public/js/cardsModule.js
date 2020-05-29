function CardsModule(dataService, eventService) {

	function compileText(text){

		var result;
		var pieces = text.split(' ')

		pieces = pieces.map(function(word){

			if (word[0] == '[') {

				try {
					var content = word.split('[')[1].split(']')[0];
					var link = word.split('(')[1].split(')')[0];

					return '<a class="card-link" href="/map.html#/goto=' + link + '">'+content+'</a>'

				} catch(e) {

					var content = word.split('[')[1].split(']')[0];

					return '<a class="broken-link" href="/map.html#/goto=' + link + '">'+content+'</a>'
				}

				

			}

			return word

		})

		result = pieces.join(' ');

		return result;

	}

	function renderCards(){

		var spaces = dataService.getSpaces();

		spaces.forEach(function(space, index) {

		  	var resultHtml = ''
		  	var cardHtml = '';

		  	var spaceElem = document.querySelector('.space-' + index);

			if (space.cards) {

			    space.cards.forEach(function(card){

			      cardHtml = '<div class="card" ' + 
			      'data-id="'+ card.id + '" '+
			      'style="'+
			      'left: ' + card.position.x + 'px;'+
			      'top: ' + card.position.y + 'px;'+
			      'width: ' + card.style.width + 'px;'+
			      'height: ' + card.style.height + 'px;'+
			      '" >';

			      card.text_compiled = compileText(card.text);

			      cardHtml = cardHtml + '<div class="card-content">'
			      cardHtml = cardHtml + '<div class="draggable-corner" title="Переместить"></div>';
			      cardHtml = cardHtml + '<div class="delete-corner" title="Удалить"></div>';
			      cardHtml = cardHtml + '<div class="resize-corner" title="Растянуть"></div>';
			      cardHtml = cardHtml + '<div class="edit-corner" title="Редактировать"></div>';

			      cardHtml = cardHtml + '<input class="card-title" type="text" value="' + card.title + '">';
			      cardHtml = cardHtml + '<div class="card-text-compiled">' + card.text_compiled + '</div>';
			      cardHtml = cardHtml + '<textarea class="card-text">' + card.text + '</textarea>';

			      cardHtml = cardHtml + '</div>'
			      cardHtml = cardHtml + '</div>'

			      resultHtml = resultHtml + cardHtml;



			    })

			}

			spaceElem.querySelector('.space-content').innerHTML = resultHtml

			setCardsEventListeners(spaceElem);

		  })

	}

	function setCardDraggableListener(cardElem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var currentY;
	  var currentX;

	  var resultY;
	  var resultX;

	  var mousePressed = false;

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.addEventListener('mousedown', function(event){

	    // console.log('card mousedown event', event);

	    if (event.target.classList.contains('draggable-corner')) {

	      startX = event.clientX;
	      startY = event.clientY;

	      currentY = parseInt(cardElem.style.top.split('px')[0], 10);
      	  currentX = parseInt(cardElem.style.left.split('px')[0], 10);

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

	      card.position.x = resultX;
	      card.position.y = resultY;

	      cardElem.style.top = resultY  + 'px';
	      cardElem.style.left =   resultX + 'px';

	     
	    }

	  })

	}

	function setCardResizeListener(cardElem){

	  var startX;
	  var startY;

	  var lastX;
	  var lastY;

	  var resultHeight;
	  var resultWidth;

	  var mousePressed = false;

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  var currentWidth;
	  var currentHeight;

	  cardElem.addEventListener('mousedown', function(event){

	    // console.log('card mousedown event', event);

	    if (event.target.classList.contains('resize-corner')) {

	      startX = event.clientX;
	      startY = event.clientY;

      	  currentWidth = parseInt(cardElem.style.width.split('px')[0])
	  	  currentHeight = parseInt(cardElem.style.height.split('px')[0])

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

		      card.style.width = resultWidth;
		      cardElem.style.width = resultWidth + 'px';
		      
	      } else {

 			  card.style.width = 180;
		      cardElem.style.width = '180px';

	      }

	      if (resultHeight > 240) {

	      	card.style.height = resultHeight;
	      	cardElem.style.height =  resultHeight + 'px';

	      } else {
	      	card.style.height = 240;
	      	cardElem.style.height =  '240px';
	      }

	     
	    }

	  })

	}

	function setCardDeleteListener(cardElem) {

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.addEventListener('click', function(event) {

	  	if (event.target.classList.contains('delete-corner')){

	  		dataService.deleteCardById(cardId);

	  		eventService.dispatchEvent(EVENTS.RENDER_CARDS);
	  	}

	  })

	}

	function setCardTitleChangeListener(cardElem) {

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.querySelector('.card-title').addEventListener('focus', function(event){
	  	activeSpace = dataService.getActiveSpace();
	  })

	  cardElem.querySelector('.card-title').addEventListener('change', function(event) {

	  	card.title = this.value;

	  	console.log("card title change", card);
	  	var count = 0

	  	activeSpace.cards.forEach(function(item){

	  		if (item.title == card.title) {
	  			count = count + 1
	  		}

	  	})

	  	if (count > 1) {
	  		cardElem.classList.add('duplicate-card');
	  	} else {
	  		cardElem.classList.remove('duplicate-card');
	  	}


	  	dataService.setCardById(cardId, card);

	  })

	}

	function setCardTextChangeListener(cardElem) {

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.querySelector('.card-text').addEventListener('change', function(event) {

	  	card.text = this.value;

	  	console.log("card text change", card);

	  	dataService.setCardById(cardId, card);

	  })

	}

	function setCardTextareaBlurListener(cardElem) {

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.querySelector('.card-text').addEventListener('blur', function(event) {

	  	console.log("Textare blur");

	  	cardElem.querySelector('.card-text-compiled').style.display = 'block';
	  	cardElem.querySelector('.card-text').style.display = 'none';

	  	eventService.dispatchEvent(EVENTS.RENDER_CARDS);
	  	eventService.dispatchEvent(EVENTS.SAVE_PROJECT);

	  })

	}

	function setCardEditClickListener(cardElem) {

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.querySelector('.edit-corner').addEventListener('click', function(event) {

	  	console.log('click compiled text event', event)

	  	if (event.target.tagName != 'A') {

		  	cardElem.querySelector('.card-text-compiled').style.display = 'none';
		  	cardElem.querySelector('.card-text').style.display = 'block';

		  	cardElem.querySelector('.card-text').focus();
	  	
	  	}

	  })

	}

	function setCardsEventListeners(spaceElem){

	  var elements = spaceElem.querySelectorAll('.card');

	  var i;
	  var cardElem;

	  console.log('elements', elements);

	  elements.forEach(function(cardElem) {

	    setCardDraggableListener(cardElem);
	    setCardDeleteListener(cardElem);
	    setCardTitleChangeListener(cardElem);
	    setCardTextChangeListener(cardElem);
	    setCardResizeListener(cardElem);
	    setCardEditClickListener(cardElem);
	    setCardTextareaBlurListener(cardElem);

	  })

	}

	function setEventListeners(){

		eventService.addEventListener(EVENTS.RENDER_CARDS, function(){

			renderCards();

		})

	}

	function init(){

		setEventListeners();

	}

	return {
		init: init
	}

}