
function setOpenButtonEventListeners(){

	var buttons = document.querySelectorAll('.open-project-button');

	for(var i = 0; i < buttons.length; i = i + 1) {

		var button = buttons[i];

		button.addEventListener('click', function(event) {

			var project = button.dataset.project

			console.log('project', project);

			localStorage.setItem('activeProject', project);

			location.href = '/map.html';

		})

	}

}

function renderProjects(projects){

	var projectsContainerElem = document.querySelector('.projects-container');

	var resultHtml = '';

	projects.forEach(function(project) {

		var rowHtml = '';

		var baseName = project.split('.json')[0];

		rowHtml = '<div class="project">';

		rowHtml = rowHtml + '<div class="project-name">' + baseName + '</div>';

		rowHtml = rowHtml + '<button class="open-project-button" data-project="' + project +'">Открыть</button>'

		rowHtml = rowHtml + '</div>';

		resultHtml = resultHtml + rowHtml;

	})

	projectsContainerElem.innerHTML = resultHtml;

	setOpenButtonEventListeners();

}

function getProjects(){

	fetch('/api/projects', 
		{
			method: 'GET'
		}
	)
	.then(function(data){
		return data.json();
	})
	.then(function(data){

		var projects = data.results;

		renderProjects(projects);

		console.log('data', data);


	})

}

function init() {

	localStorage.removeItem('activeProject');
		
	getProjects();

	document.querySelector('.add-project-button').addEventListener('click', function(event){

	  var projectName = document.querySelector('.project-name-input').value;
	  var space = {
	  	name: 'Пространство',
	  	active: true,
        id: toMD5('space_' + new Date())
      }

	  var project = {
	  	name: projectName,
	  	spaces: [space]
	  }

	  fetch('/api/projects', 
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(project)
		}
	  ).then(function(data){

	  	localStorage.setItem('activeProject', projectName + '.json');

	  	location.href = '/map.html';

	  })


	})

}

init()