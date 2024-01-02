let isTouchDevice = false;
const _notes = document.getElementById('notes');

text = 'this is my new note';
let note = '';
let notes = checkIfNotesExist();

isTouchDevice = checkIfTouchDevice();
handleNewNoteDialog();
displayAllNotes(_notes);

function checkIfTouchDevice() {
	isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	if (isTouchDevice) {
		document.querySelector('.container p:nth-child(1)').innerHTML =
			"Double-tap to <span class='highlight create'>'create'</span> a task.";

		document.querySelector('.container p:nth-child(2)').innerHTML =
			"Swipe <span class='highlight del'>'right'</span> to delete a task.";

		document.querySelector('.container p.end').innerHTML =
			"Swipe <span class='highlight complete'>'left'</span> to complete a task.";

		document.body.addEventListener('touchstart', function (event) {
			event.preventDefault();
			// TODO: make notes here
			console.log('clicky click');
			// we specifically set event listener passive to false to prevent errors when touch
		}, { passive: false });
	}

	console.log('touch is ' + isTouchDevice);
	return isTouchDevice;
}

function displayAllNotes(_notes) {

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

		createNoteElement(text, index, completed);
	});
}

function checkIfNotesExist() {
	let notes;
	try {
		notes = JSON.parse(localStorage.getItem('notes'));
		if (!notes) {
			_notes.style.opacity = 0;
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

	handleNoteFormSubmission();
}
function handleNoteFormSubmission() {
	document.getElementById('noteDialog').addEventListener('submit', function (event) {
		event.preventDefault();
		let noteText = document.getElementById('noteInput').value;

		// push them to the array
		notes.push({ text: noteText, completed: false });
		// store the array into localStorage
		localStorage.setItem('notes', JSON.stringify(notes));
		createNoteElement(noteText, notes.length - 1);
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

function createNoteElement(text, index, completed) {

	_notes.style.opacity = 1;
	const noteContainer = document.createElement('div');
	noteContainer.classList.add('note');
	noteContainer.style.display = 'flex';
	noteContainer.style.alignItems = 'center';
	noteContainer.style.gap = '1rem';


	if (completed) {
		noteContainer.classList.add('strike-through');
	}

	let newNote = document.createTextNode(`${index + 1}: ${text}`);
	const trashcan = document.createElement('span');
	// delete note elements
	trashcan.classList.add('icon', 'trashcan');
	noteContainer.appendChild(trashcan);
	noteContainer.appendChild(newNote);

	// check note elements
	const check = document.createElement('span');
	check.classList.add('icon', 'checkmark');
	noteContainer.appendChild(check);

	_notes.appendChild(noteContainer);
}

function handleCompletedDialog() {
	// for desktop keydown
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
	// for touches
	if (isTouchDevice) {
		const noteContainer = document.querySelector('.notes');
		const noteElements = Array.from(noteContainer.children).filter(notes => notes.classList.contains('note'));
		noteElements.forEach((note, index) => {
			let touchstartX = 0;
			let touchendX = 0;

			note.addEventListener('touchstart', function (event) {
				touchstartX = event.changedTouches[0].screenX;
				console.log('touch start: ' + event);
			}, false);

			note.addEventListener('touchend', function (event) {
				touchendX = event.changedTouches[0].screenX;
				handleSwipe(note, index, touchstartX, touchendX);
				console.log('touch end');
			}, false);

		});
	}

}

function handleSwipe(note, index, touchstartX, touchendX) {
	let swipeLength = touchstartX - touchendX;
	// left swipe
	if (swipeLength > 100) { // Change this value to adjust the sensitivity
		completeTask(note, index);
		console.log('' + index + ' completed');
	}
	// right swipe
	if (swipeLength < -100) { // Change this value to adjust the sensitivity
		deleteNote(note, index);
		console.log('' + index + ' deleted');
	}
}

function completeTask(note, noteNumber) {
	let notes = JSON.parse(localStorage.getItem('notes'));

	notes[noteNumber].completed = true;
	localStorage.setItem('notes', JSON.stringify(notes));
	note.classList.add('strike-through');
}

function deleteNote(note, noteNumber) {
	let notes = JSON.parse(localStorage.getItem('notes'));
	notes.splice(noteNumber, 1);
	localStorage.setItem('notes', JSON.stringify(notes));

	if (notes.length === 0) {
		localStorage.removeItem('notes');
		_notes.style.opacity = 0;
	}
	else {
		_notes.style.opacity = 1;
	}

	note.remove();
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


handleDeleteNoteDialog();
handleCompletedDialog();


