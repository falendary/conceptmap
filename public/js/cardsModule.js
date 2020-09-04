function CardsModule(dataService, eventService) {

	function eatLink(pos, text){

		var index = pos + 1;
		var token = {
			valueText: '',
			valueLink: '',
			type: 'link'
		}


		for (index; index < text.length; index = index + 1) {

			if (text[index] == ']') {
				break;
			} else {
				token.valueText = token.valueText + text[index];
			}

		}

		var index = index + 1; // move index to ]

		if (text[index] == '(') {

			var index = index + 1; // skip pos at ( 

			for (index; index < text.length; index = index + 1) {

				if (text[index] == ')') {
					break;
				} else {
					token.valueLink = token.valueLink + text[index];
				}

			}

		}

		return token


	}

	function eatBold(pos, text){

		var token = {
			value: '',
			type: 'bold'
		}

		var index = pos + 1; // start from next symbol to _

		for (index; index < text.length; index = index + 1) {

			if (text[index] == '*') {
				break;
			} else {
				token.value = token.value + text[index];
			}

		}

		return token;

	}

	function eatCursive(pos, text){

		var token = {
			value: '',
			type: 'cursive'
		}

		var index = pos + 1; // start from next symbol to _

		for (index; index < text.length; index = index + 1) {

			if (text[index] == '_') {
				break;
			} else {
				token.value = token.value + text[index];
			}

		}

		return token;

	}

	function compileText(text){

		var resultText = '';
		var pos = 0;
		var processing = true;
		var token;

		// console.log('compileText.text', text)

		if (!text.length) {
			processing = false;
		}

		while (processing) {
			
			if (text[pos] == '_' && (pos == 0 || text[pos - 1] == ' ')) {

				token = eatCursive(pos, text);

				pos = pos + token.value.length + 2; // for both _ 

			}
			else if (text[pos] == '*') {

				token = eatBold(pos, text);

				pos = pos + token.value.length + 2; // for both _ 

			}
			else if (text[pos] == '[') {

				token = eatLink(pos, text);

				pos = pos + token.valueText.length + 2; // for [ and ]
				pos = pos + token.valueLink.length + 2; // for ( and )

			}
			else {

				token = {
					value: text[pos],
					type: 'unknown'
				}
				pos = pos + token.value.length;

			}

			if (token) {

				if (token.type == 'unknown') {
					resultText = resultText + token.value;
				}

				if (token.type == 'cursive') {
					resultText = resultText + '<i>' + token.value + '</i>';
				}

				if (token.type == 'bold') {
					resultText = resultText + '<b>' + token.value + '</b>';
				}

				if (token.type == 'link') {
					
					if (token.valueLink) {

						resultText = resultText + '<a class="card-link" href="map.html#/goto=' + token.valueLink + '">' + token.valueText + '</a>';

					} else {

						resultText = resultText + '<a class="broken-link" href="map.html">' + token.valueText + '</a>';

					}
				}

			}
			
			if (pos >= text.length) {
				processing = false;
			}

		}

		// console.log('compileText.resultText', resultText);

		return resultText;

	}

	function renderColorPicker(card){

		var result = '';

		// result = result + '<input type="color" id="color-picker-'+card.id+'" class="card-color-picker" value="'+card.style.backgroundColor+'">'

		result = result + '<select class="card-color-picker-select" id="color-picker-'+card.id+'" value="'+card.style.backgroundColor+'">';

		result = result + '<option value="">Ничего</option>'
		result = result + '<option value="#BEFABE">Зеленый</option>'
		result = result + '<option value="#FFF3A6">Желтый</option>'
		result = result + '<option value="#FFD6D6">Красный</option>'
		result = result + '</select>'

		return result;

	}

	function renderCards(){

		var activeSpace = dataService.getActiveSpace();

		var resultHtml = ''
	  	var cardHtml = '';

	  	var activeSpaceElem = dataService.getActiveSpaceElem();

	  	console.log('renderCards activeSpace', activeSpace);
	  	console.log('renderCards activeSpaceElem', activeSpaceElem);

		if (activeSpace.cards) {

		    activeSpace.cards.forEach(function(card){

		      var active = '';
		      var emptyContent = '';

		      if (!card.text.length) {
		      	emptyContent = 'empty-content-card'
		      }

		      if(card.active) {
		      	active = 'active'
		      }

		      cardHtml = '<div class="card ' + active+  ' ' + emptyContent +'" ' + 
		      'data-id="'+ card.id + '" '+
		      'style="'+
		      'background-color:' + card.style.backgroundColor + ';' +
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
		      cardHtml = cardHtml + '<div class="bg-color-corner" title="Сменить Фон"></div>';

		      cardHtml = cardHtml + renderColorPicker(card);

		      cardHtml = cardHtml + '<input class="card-title" type="text" value="' + card.title + '">';
		      cardHtml = cardHtml + '<div class="card-text-compiled">' + card.text_compiled + '</div>';
		      cardHtml = cardHtml + '<textarea class="card-text">' + card.text + '</textarea>';

		      cardHtml = cardHtml + '</div>'
		      cardHtml = cardHtml + '</div>'

		      resultHtml = resultHtml + cardHtml;


		    })

		}

		var container = activeSpaceElem.querySelector('.space-content').querySelector('.cards-container');

		if(!container) {

			var elem = document.createElement('div')
			elem.classList.add('cards-container')
			activeSpaceElem.querySelector('.space-content').appendChild(elem)

			container = activeSpaceElem.querySelector('.space-content').querySelector('.cards-container');
		}

		container.innerHTML = resultHtml

		setCardsEventListeners(activeSpaceElem);

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

	  var diffTop;
	  var diffLeft;

	  var mousePressed = false;

	  var cardId = cardElem.dataset.id
	  var card = dataService.getCardById(cardId);

	  cardElem.addEventListener('mousedown', function(event){

	    console.log('card mousedown event', event);

	    if (event.target.classList.contains('draggable-corner') ||
	   		event.target.classList.contains('card-text-compiled') ||
	    	event.target.classList.contains('card-content')) {

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

	    window.isDragging = false;

	  })

	  document.body.addEventListener('mousemove', function(event) {

	  	// console.log('mousePressed', mousePressed);

	    if (mousePressed) {

	      currentScale = dataService.getCurrentScale();

	      window.isDragging = true;

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

	  	console.log("Textare blur", card);

	  	card.text = this.value;
	  	dataService.setCardById(cardId, card);

	  	cardElem.querySelector('.card-text-compiled').style.display = 'block';
	  	cardElem.querySelector('.card-text').style.display = 'none';

	  	eventService.dispatchEvent(EVENTS.RENDER_CARDS);
	  	eventService.dispatchEvent(EVENTS.SAVE_PROJECT);

	  })

	}

	function setCardEditClickListener(elem) {

	  var cardId = elem.dataset.id
	  var card = dataService.getCardById(cardId);

	  elem.addEventListener('dblclick', function(event) {

	  	console.log('click compiled text event', event)

	  	if (event.target.tagName != 'A') {

		  	elem.querySelector('.card-text-compiled').style.display = 'none';
		  	elem.querySelector('.card-text').style.display = 'block';

		  	elem.querySelector('.card-text').focus();
	  	
	  	}

	  })

	}

	function setCardBgColorClickListener(elem) {

	  var cardId = elem.dataset.id
	  var card = dataService.getCardById(cardId);

	  elem.addEventListener('click', function(event) {

	  	if (event.target.classList.contains('bg-color-corner')){

	  		console.log("clicked on bg color editor?")

	  		elem.querySelector('.card-color-picker-select').classList.add('active')
	  		elem.querySelector('.card-color-picker-select').click();

	  	}

	  })

	}

	function setCardBgColorChangeListener(elem) {

	  var cardId = elem.dataset.id
	  var card = dataService.getCardById(cardId);

	  var select = elem.querySelector('.card-color-picker-select')

	  select.addEventListener('change', function(event) {

	  	console.log('click compiled text event', event)

	  	console.log('this.value', this.value)

	  	card.style.backgroundColor = this.value;

		elem.style.backgroundColor = this.value;

		select.classList.remove('active');

		dataService.setCardById(cardId, card);
	  	
	  })

	}


	function setCardsEventListeners(spaceElem){

	  var elements = spaceElem.querySelectorAll('.card');

	  elements.forEach(function(elem) {

	    setCardDraggableListener(elem);
	    setCardDeleteListener(elem);
	    setCardTitleChangeListener(elem);
	    setCardTextChangeListener(elem);
	    setCardResizeListener(elem);
	    setCardEditClickListener(elem);
	    setCardBgColorClickListener(elem);
	    setCardTextareaBlurListener(elem);
	    setCardBgColorChangeListener(elem);

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