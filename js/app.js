const element = document.getElementById('notes');

text = 'this is my new note';
let note = '';

// add event listener for keydown
handleDialog();

let notes = checkIfNotesExist();

displayAllNotes(notes);


function displayAllNotes(notes) {
	notes.forEach((note, index) => {
		addNewNote(note, index);
	});
}

function checkIfNotesExist() {
	let notes;
	try {
		notes = JSON.parse(localStorage.getItem('notes'));
		if (!notes) {
			// element.style.display = 'none';
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
		addNewNote(noteText, notes.length - 1);
		console.log('new note added');
		this.close();
	});
}

function addNewNote(text, index) {
	let noteContainer = document.createElement('div');
	noteContainer.classList.add('note');
	noteContainer.style.display = 'flex';
	noteContainer.style.alignItems = 'center';
	noteContainer.style.gap = '1rem';

	let newNote = document.createTextNode(`${index + 1}: ${text}`);
	noteContainer.appendChild(newNote);

	element.appendChild(noteContainer);
}
function handleCompletedDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key === 'c') {
			let completedDialog = document.getElementById('completedDialog');

			completedDialog.showModal();
		}
	});

	document.getElementById('completedDialog').addEventListener('submit', function (event) {
		event.preventDefault();
		let noteNumber = Number(document.getElementById('completedTaskNumber').value);
		completeTask(noteNumber - 1);
		this.close();

	});
}

function completeTask(noteNumber) {
	let notes = JSON.parse(localStorage.getItem('notes'));
	let completedNote = notes[noteNumber];
	notes.splice(noteNumber, 1);
	// Select the note element
	let noteElement = document.querySelectorAll('.note')[noteNumber];

	// Add the 'completed' class to the note element
	noteElement.classList.add('strike-through');

}

function handleDeleteNoteDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key === 'd') {
			let deleteDialog = document.getElementById('deleteDialog');
			if (deleteDialog.open || noteDialog.open || completedDialog.open) {
				return;
			}

			deleteDialog.showModal();
		}
	});

	document.getElementById('deleteDialog').addEventListener('submit', function (event) {
		event.preventDefault();
		let noteNumber = Number(document.getElementById('noteNumber').value);
		deleteNote(noteNumber - 1);
		this.close();

	});
}

function deleteNote(noteNumber) {
	let notes = JSON.parse(localStorage.getItem('notes'));
	notes.splice(noteNumber, 1);
	localStorage.setItem('notes', JSON.stringify(notes));
	location.reload();
}

handleDeleteNoteDialog();
handleCompletedDialog();


