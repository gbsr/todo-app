let isTouchDevice = false;
const element = document.getElementById('notes');

text = 'this is my new note';
let note = '';
let notes = checkIfNotesExist();

isTouchDevice = checkIfTouchDevice();
handleNewNoteDialog();
displayAllNotes(notes);

function checkIfTouchDevice() {
	isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	if (isTouchDevice) {
		document.querySelector('.container p:nth-child(1)').innerHTML =
			"Tap to <span class='highlight create'>'create'</span> a task.";

		document.querySelector('.container p:nth-child(2)').innerHTML =
			"Swipe <span class='highlight delete'>'right'</span> to delete a task.";

		document.querySelector('.container p.end').innerHTML =
			"Swipe <span class='highlight complete'>'left'</span> to complete a task.";

		document.body.addEventListener('touchstart', function (event) {
			event.preventDefault();
			// TODO: make notes here
			console.log('clicky click');
		});
	}

	console.log('touch is ' + isTouchDevice);
	return isTouchDevice;
}

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
	let timeout = null;
	keyDown();
	console.log('isTouchDevice: ' + isTouchDevice);
	if (isTouchDevice) {
		let lastTap = 0;
		({ lastTap, timeout } = doubleTap(lastTap, timeout));
	}

	addNote();
}
function addNote() {
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

function doubleTap(lastTap, timeout) {
	document.body.addEventListener('touchend', function (event) {
		let currentTime = new Date().getTime();
		let tapLength = currentTime - lastTap;
		clearTimeout(timeout);
		if (tapLength < 850 && tapLength > 0) {
			event.preventDefault();
			console.log('double tapped');
			let noteDialog = document.getElementById('noteDialog');

			if (!noteDialog.open) {
				noteDialog.showModal();
			}

			// hack to clear the input field, without this, the input field will have the previous value
			setTimeout(function () {
				document.getElementById('noteInput').value = '';
			}, 0);
		} else {
			timeout = setTimeout(function () {
				clearTimeout(timeout);
			}, 850);
		}
		lastTap = currentTime;
	});
	return { lastTap, timeout };
}

function keyDown() {
	let noteDialog = document.getElementById('noteDialog');
	document.addEventListener('keydown', function (event) {
		if (event.key.toLowerCase() === 'n') {
			if (!noteDialog.open) {
				noteDialog.showModal();
			}

			if (document.activeElement === document.getElementById('noteInput')) {
				return;
			}
		}
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

	if (isTouchDevice) {
		let noteContainers = document.querySelectorAll('.noteContainer');

		noteContainers.forEach((noteContainer, index) => {
			let touchstartX = 0;
			let touchendX = 0;

			noteContainer.addEventListener('touchstart', function (event) {
				touchstartX = event.changedTouches[0].screenX;
			}, false);

			noteContainer.addEventListener('touchend', function (event) {
				touchendX = event.changedTouches[0].screenX;
				handleSwipe();
			}, false);

			function handleSwipe() {
				if (touchendX < touchstartX) {
					deleteNote(index);
				}
			}
		});
	}

	notes[noteNumber].completed = true;
	localStorage.setItem('notes', JSON.stringify(notes));
	location.reload();
}

function deleteNote(noteNumber) {
	notes.splice(noteNumber, 1);
	displayNotes();
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


