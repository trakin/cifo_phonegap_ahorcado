var app = {
	
	array_words: ["BAR", "UNIVERSITAT", "CICLISME", "MESSI", "INDURAIN", "PILOTA", "PHONEGAP", "CIFO", "ESPECIALISTA", "TELEVISIO"],	
	word: "",	
	array_vowels: ["A", "E", "I", "O", "U"],	
	array_consonants: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "Ñ", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"],	
	label_hanged: 0,
	num_letters_correct: 0,
	model_dades_marcador: {'marcador': {'wins': 0, 'losts': 0}},
	
	init: function (){
	
		app.clean();
		
		app.createLetters();
		app.createFields();
		app.initButtons();
		
		app.refreshMarcador();

	},
	
	createLetters: function(){
		for (var i = 0; i < app.array_vowels.length; i++) {
			$('#letters').append($('<button class="letter" id="' + app.array_vowels[i] + '">' + app.array_vowels[i] + '</button>'));
		}

		for (var i = 0; i < app.array_consonants.length; i++) {
			$('#letters').append($('<button class="letter" id="' + app.array_consonants[i] + '">' + app.array_consonants[i] + '</button>'));
		}
	},
	
	createFields: function(){
	
		app.word = app.array_words[Math.floor(Math.random()*app.array_words.length)];

		//alert(app.word);

		for (var i = 0; i < app.word.length; i++) {
			$('#fields').append($('<div class="field field_letter_' + app.word[i] + '"></div>'));
		}
		
	},
	
	initButtons: function(){
		$("button.letter").each(function( index ) {
			$( this ).click(function(){
				app.checkLetter($( this ).attr("id"));
			});
		});	
		
		$('button#reset_marcador').click(function(){
			app.resetMarcador();
		});
	},
	
	checkLetter: function(letter_clicked){
	
		var letter_correct = false;

		for (var i = 0; i < app.word.length; i++) {

			if(letter_clicked == app.word[i]){
				//Hem encertat la lletra.
				//Hem de mostrar la lletra i deshabilitar el botó

				letter_correct = true;
				$('.field_letter_' + letter_clicked).each(function(){
					if(!$(this).hasClass("field_full")){
						$(this).html(letter_clicked);
						$(this).addClass("field_full");
						app.num_letters_correct++;
					}
				});

			}

		}

		if(!letter_correct){
			//Hem fallat
			//Hem de modificar la imatge de l'ahorcador
			//Si és la imatge final, hem de mostrar un popup i quan cliquem, reiniciar el joc

			app.label_hanged++;
			$('#img_ahorcado').attr('src', 'img/ahorcado' + app.label_hanged + '.png');

			if(app.label_hanged === 7){
				
				setTimeout(function(){ 
					alert("Has perdut!");
					app.model_dades_marcador.marcador.losts++;
					app.grabarDatos();
					app.init();
				}, 300);
				
			}
		}

		if(app.num_letters_correct === app.word.length){
			setTimeout(function(){ 
				alert("Has guanyat!");
				app.model_dades_marcador.marcador.wins++;
				app.grabarDatos();
				app.init();
			}, 300);
		}

		$('#' + letter_clicked).addClass('disabled');
	},
	
	leerDatos: function () {
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory,
										 this.obtenerFS, this.fail);
	},
	
	obtenerFS: function (fileSystem) {
		fileSystem.getFile("files/" + "marcador.json", null, app.obtenerFileEntry, app.noFile);
	},
	
	obtenerFileEntry: function (fileEntry) {
		fileEntry.file(app.leerFile, app.fail);
	},
	
	leerFile: function (file) {
		var reader = new FileReader();
		reader.onloadend = function (evt) {
			var data = evt.target.result;
			if (data !== null){
				app.model_dades_marcador = JSON.parse(data);
			}
			app.init();
		};
		reader.readAsText(file);
	},
	
	noFile: function (error) {
		app.init();
	},
	
	grabarDatos: function () {
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.hayFS, this.fail);
	},
	
	hayFS: function (fileSystem) {
		fileSystem.getFile("files/" + "marcador.json", {create: true, exclusive: false}, app.hayFichero, app.fail);
	},
	
	hayFichero: function (fileEntry) {
		fileEntry.createWriter(app.hayWriter, app.fail);
	},
	
	hayWriter: function (writer) {
		writer.onwriteend = function (evt) {
			console.log("datos grabados en externalApplicationStorageDirectory");
		};
		writer.write(JSON.stringify(app.model_dades_marcador));
	},
	
	fail: function (error) {
		alert(error.code);
	},
	
	refreshMarcador: function(){
		var marcador = this.model_dades_marcador.marcador;
		$('#num_wins').html(marcador.wins);
		$('#num_losts').html(marcador.losts);
	},
	
	resetMarcador: function(){
		app.model_dades_marcador.marcador.wins = 0;
		app.model_dades_marcador.marcador.losts = 0;
		app.refreshMarcador();
		app.grabarDatos();
	},
	
	clean: function(){
		app.label_hanged = 0;
		app.num_letters_correct = 0;
		$('#fields').html('');
		$('#letters').html('');
		$('#img_ahorcado').attr("src", "img/ahorcado0.png");
	}
}


if ('addEventListener' in document) {
	document.addEventListener('deviceready', function () {
		app.leerDatos();
	}, false);
}