const services = {
	getAllFolders(db) {
		return db.select('*').from('folders');
	},
	getAllNotes(db) {
		return db.select('*').from('notes');
	},

	getFolder(db, id) {
		return db.select('*').from('folders').where('id', id).first();
	},
	getNote(db, id) {
		return db.select('*').from('notes').where('id', id);
	},
	postFolder(db, folder) {
				
		
		return db.insert([folder]).into('folders').returning('*').then((rows) => {
			console.log("rows.......",rows)
			return rows[0];
		}).catch(err=>console.log(err));
	},
	postNote(db, note) {
		const notes = [];
		notes.push(note);

		return db.insert(notes).into('notes').returning('*').then((rows) => {
			return rows[0];
		});
	},
	deleteFolder(db, id) {
		return db('folders').where({ id }).delete();
	},
	deleteNote(db, id) {
		return db('notes').where({ id }).delete();
	},
	updateFolder(db, id, newFolder) {
		return db('folders').where({ id }).update(newFolder);
	},
	updateNote(db, id, notes) {
		return db('notes').where({ id }).update(notes);
	}
};

module.exports = services;
