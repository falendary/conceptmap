function CardsModule(dataService, eventService) {

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

			      cardHtml = cardHtml + '<div class="card-content">'
			      cardHtml = cardHtml + '<div class="draggable-corner" title="Переместить"></div>';
			      cardHtml = cardHtml + '<div class="delete-corner" title="Удалить"></div>';
			      cardHtml = cardHtml + '<div class="resize-corner" title="Растянуть"></div>';

			      cardHtml = cardHtml + '<input class="card-title" type="text" value="' + card.title + '">';
			      cardHtml = cardHtml + '<textarea class="card-text">' + card.text + '</textarea>';

			      cardHtml = cardHtml + '</div>'
			      cardHtml = cardHtml + '</div>'

			      resultHtml = resultHtml + cardHtml;



			    })

			}

			spaceElem.querySelector('.space-content').innerHTML = resultHtml

			setCardsEventListeners();

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

	  cardElem.querySelector('.card-title').addEventListener('change', function(event) {

	  	card.title = this.value;

	  	console.log("card title change", card);

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

	function setCardsEventListeners(){

	  var elements = document.querySelectorAll('.card');

	  var i;
	  var cardElem;

	  for(i = 0; i < elements.length; i = i + 1) {

	    cardElem = elements[i];

	    setCardDraggableListener(cardElem);
	    setCardDeleteListener(cardElem);
	    setCardTitleChangeListener(cardElem);
	    setCardTextChangeListener(cardElem);
	    setCardResizeListener(cardElem);

	  }

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