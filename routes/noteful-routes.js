const express = require('express');
const notefulRoute = express.Router();
const bodyParser = express.json();
const xss = require('xss');
const logger = require('../src/logger');
const services = require('../noteful-services/services');

////***********************Route for folders***********************//////
//get and post folders
notefulRoute
	.route('/folders')
	.get((req, res, next) => {
		services.getAllFolders(req.app.get('db')).then((folders) => 
		res.status(200).json(folders)).catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		let { title } = req.body;
		const newFolder = { title };
		const sanitizedData = {
			title: xss(newFolder.title)
		};
		//checks whether the user input a title
		if (!newFolder.title) {
			logger.error(`title is required`);
			return res.status(400).send({
				error: { message: `Missing 'title' in request body` }
			});
		}

		//validation of the user input can go here...............

		services
			.postFolder(req.app.get('db'), sanitizedData)
			.then((folder) => {
				logger.info(`Folder with id ${folder.id} created`);
				res.status(201).json(folder);
			})
			.catch(next);
	});

//get, patch and delete folders by id
notefulRoute
	.route('/folders/:id')
	.all((req, res, next) => {
		const { id } = req.params;
		services.getFolder(req.app.get('db'), id).then((folder) => {
			if (!folder || folder.length === 0) {
			logger.error('Folder Not Found');
				return res.status(404).json({
					error: { message: 'Folder Not Found' }
				});
			}
			const sanitizedFolder = {
				id:folder.id,
				title:xss(folder.title),
				date_published: folder.date_published
			}
			res.folder = sanitizedFolder;
			next();
		});
	})
	.get((req, res, next) => {
		res.status(200).json(res.folder);
	})
	.patch(bodyParser, (req, res, next) => {
		const { id } = req.params;
		const { title } = req.body;
		const folder = { title };
		//checks that title is defined
		if (!title) {
			logger.error('Title Must Be defined');
			return res.status(404).send('Title Must Be defined');
		}

		//validation goes here.............

		services.updateFolder(req.app.get('db'), id, folder).then((folder) => res.status(204).end()).catch(next);
	})
	.delete((req, res, next) => {
		const { id } = req.params;

		//validation goes here.............

		services.deleteFolder(req.app.get('db'), id).then((folder) => res.status(204).end()).catch(next);
	});

///*****************Notes Routes************ ***////
//get and post for notes
notefulRoute
	.route('/notes')
	.get((req, res, next) => {
		services.getAllNotes(req.app.get('db')).then((notes) => res.status(200).json(notes)).catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		const { title, modified, note, folders } = req.body;
		const newNotes = { title, modified, note, folders };
		const sanitizedData = {
			title: xss(newNotes.title),
			modified: newNotes.modified,
			note: xss(newNotes.note),
			folders: newNotes.folders
		};
	
		//checks whether the user input a the proper fields
		for (const field of [ 'title', 'modified', 'note', 'folders' ]) {
			if (!sanitizedData[field]) {
				logger.error(`${field} is required`);
				return res.status(400).send({
					error: { message: `${field} is required` }
				});
			}
		}

		//validation of the user input can go here...............

		services
			.postNote(req.app.get('db'), sanitizedData)
			.then((note) => {
				res.status(201).json(note);
			})
			.catch(next);
	});

//get, patch and delete note by id
notefulRoute
	.route('/notes/:id')
	.all((req, res, next) => {
		const { id } = req.params;
		services.getNote(req.app.get('db'), id).then((note) => {
			if (!note || note.length === 0) {
				logger.error('Note Not Found');
				return res.status(404).json({
					error: { message: 'Note Not Found' }
				});
			}
			res.note = note;
			next();
		});
	})
	.get((req, res, next) => {
		res.status(201).json(res.note);
	})
	.patch(bodyParser, (req, res, next) => {
		const { id } = req.params;
		const { title, modified, note, folders } = req.body;
		const updatedNote = { title, modified, note, folders };		
		const sanitizedData = {
			title: xss(updatedNote.title),
			modified:updatedNote.modified,
			note: xss(updatedNote.note),
			folders:updatedNote.folders
		};

		//checks that title is defined
		const numberOfValues = Object.values(sanitizedData).filter(Boolean).length;

		if (numberOfValues === 0) {
			logger.error('At least one of the fields Must Be defined');
			return res.status(404).send('At least one of the fields Must Be defined');
		}

		//validation goes here.............

		services.updateNote(req.app.get('db'), id, sanitizedData).then((note) => res.status(204).end()).catch(next);
	})
	.delete((req, res, next) => {
		const { id } = req.params;
	services.deleteNote(req.app.get('db'), id).then((note) => res.status(204).end()).catch(next);
	});

module.exports = notefulRoute;
