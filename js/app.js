const element = document.getElementById('notes');

text = 'this is my new note';
let note = '';

// add event listener for keydown
handleNewNoteDialog();

let notes = checkIfNotesExist();

displayAllNotes(notes);


function displayAllNotes(notes) {
	notes.forEach((note, index) => {
		let text;
		let completed;

		if (typeof note === 'string') {
			text = note;
			completed = false;
		} else {
			text = note.text;
			completed = note.completed;
		}

		addNewNote(text, index, completed);
	});
}

function checkIfNotesExist() {
	let notes;
	try {
		notes = JSON.parse(localStorage.getItem('notes'));
		if (!notes) {
			element.style.opacity = 0;
			notes = [];
		}
	} catch (error) {
		console.error('Error reading notes from localStorage:', error);
		notes = [];
	}
	return notes;
}

function handleNewNoteDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key.toLowerCase() === 'n') {
			if (document.activeElement === document.getElementById('noteInput')) {
				return;
			}
			let noteDialog = document.getElementById('noteDialog');
			noteDialog.showModal();

			// hack to clear the input field, without this, the input field will have the previous value
			setTimeout(function () {
				document.getElementById('noteInput').value = '';
			}, 0);
		}
	});

	document.getElementById('noteDialog').addEventListener('submit', function (event) {
		event.preventDefault();
		let noteText = document.getElementById('noteInput').value;

		// push them to the array
		notes.push({ text: noteText, completed: false });
		// store the array into localStorage
		localStorage.setItem('notes', JSON.stringify(notes));
		addNewNote(noteText, notes.length - 1);
		console.log('new note added');
		this.close();
	});
}

function addNewNote(text, index, completed) {

	element.style.opacity = 1;
	let noteContainer = document.createElement('div');
	noteContainer.classList.add('note');
	noteContainer.style.display = 'flex';
	noteContainer.style.alignItems = 'center';
	noteContainer.style.gap = '1rem';

	if (completed) {
		noteContainer.classList.add('strike-through');
	}

	let newNote = document.createTextNode(`${index + 1}: ${text}`);
	noteContainer.appendChild(newNote);

	element.appendChild(noteContainer);
}
function handleCompletedDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key.toLowerCase() === 'c') {
			let completedDialog = document.getElementById('completedDialog');
			if (deleteDialog.open || noteDialog.open || completedDialog.open) {
				return;
			}
			document.getElementById('completedTaskNumber').value = '';
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
	notes[noteNumber].completed = true;
	localStorage.setItem('notes', JSON.stringify(notes));
	location.reload();
}

function handleDeleteNoteDialog() {
	document.addEventListener('keydown', function (event) {
		if (event.key.toLowerCase() === 'd') {
			let deleteDialog = document.getElementById('deleteDialog');
			if (deleteDialog.open || noteDialog.open || completedDialog.open) {
				return;
			}

			deleteDialog.showModal();
			document.getElementById('noteNumber').value = '';
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

	if (notes.length === 0) {
		localStorage.removeItem('notes');
		element.style.opacity = 0;
	}
	else {
		element.style.opacity = 1;
	}

	location.reload();
}

handleDeleteNoteDialog();
handleCompletedDialog();


