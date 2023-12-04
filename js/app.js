const element = document.getElementById('notes');

text = 'this is my new note';
let note = '';

// add event listener for keydown
handleDialog();

let notes = checkIfNotesExist();

displayAllNotes(notes);


function displayAllNotes(notes,) {
	for (let note of notes) {
		addNewNote(note);
	}
}

function checkIfNotesExist() {
	let notes;
	try {
		notes = JSON.parse(localStorage.getItem('notes'));
		if (!notes) {
			notes = [];
		}
	} catch (error) {
		console.error('Error reading notes from localStorage:', error);
		notes = [];
	}
	return notes;
}

function handleDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key === 'n') {
			let noteDialog = document.getElementById('noteDialog');
			noteDialog.showModal();


		}
	});

	document.getElementById('noteDialog').addEventListener('submit', function (event) {
		event.preventDefault();
		let noteText = document.getElementById('noteInput').value;

		// push them to the array
		notes.push(noteText);
		// store the array into localStorage
		localStorage.setItem('notes', JSON.stringify(notes));
		addNewNote(noteText);
		console.log('new note added');
		this.close();
	});
}

function addNewNote(text) {
	let noteContainer = document.createElement('div');
	element.appendChild(noteContainer);
	let newNote = document.createTextNode(text);
	element.appendChild(newNote);
}


