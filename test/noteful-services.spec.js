const NotfulServices = require('../noteful-services/services');
const config = require('../src/config');
const knex = require('knex');

describe(`Noteful services `, function() {
	let db;
	//test data for folder
	let testFolders = [
		{ id: 1, date_published: new Date('2029-01-22T16:28:32.615Z'), title: 'folder 1' },
		{ id: 2, date_published: new Date('2029-01-22T16:28:32.615Z'), title: 'folder 2' },
		{ id: 3, date_published: new Date('2029-01-22T16:28:32.615Z'), title: 'folder 3' }
	];
	//before anything create a connection with the database
	before(() => {
		db = knex({
			client: 'pg',
			connection: config.TEST_DB_CONNECTION
		});
	});

	//after the connection has been established and after the testes have run destroy the connection 'db'
	after(() => db.destroy());

	//after each test clean up the table and remove all the data to avoid data leak
	afterEach(() => db('folders').truncate());

	//this test checks whether or not the 'getAllFolders' resolve with the same data that was inserted into the table- folders
	context(`Given 'folders' has data`, () => {
		/*every time the test is run this will clear out everything in the table 
    to avoid having multiple data inserted in to the table
    */
		before(() => db('folders').truncate());

		//after a connection have been established, before any thing insert data into the database(table- folders)
		beforeEach(() => {
			return db.into('folders').insert(testFolders);
		});
		it(` getAllFoldes() resolves all folders from the 'folders' table`, () => {
			return NotfulServices.getAllFolders(db).then((actual) => {
				expect(actual).to.eql(testFolders);
			});
		});

		it(`getFolder() resolves an folder by id from 'folder' table`, () => {
			const thirdId = 3;
			const thirdTestFolder = testFolders[thirdId - 1];
			return NotfulServices.getFolder(db, thirdId).then((actual) => {
				expect(actual).to.eql({
					id: thirdId,
					title: thirdTestFolder.title,
					date_published: thirdTestFolder.date_published
				});
			});
		});

		it(`deleteFolder() removes folder by id from 'folder' table`, () => {
			const folderId = 3;
			return NotfulServices.deleteFolder(db, folderId)
				.then(() => NotfulServices.getAllFolders(db))
				.then((allfolder) => {
					// copy the test folder array without the "deleted" article
					const expected = testFolders.filter((folder) => folder.id !== folderId);
					expect(allfolder).to.eql(expected);
				});
		});

		it(`updateFolder() updates folder from the 'folders' table`, () => {
			const idOfFolderToUpdate = 3;
			const newFolderdata = {
				title: 'updated title',
				date_published: new Date()
			};
			return NotfulServices.updateFolder(db, idOfFolderToUpdate, newFolderdata)
				.then(() => NotfulServices.getFolder(db, idOfFolderToUpdate))
				.then((folder) => {
					expect(folder).to.eql({
						id: idOfFolderToUpdate,
						...newFolderdata
					});
				});
		});
	});

	//if the there is no data
	context(`Given 'folders' has no data`, () => {
		it(`getAllFolders() resolves an empty array`, () => {
			return NotfulServices.getAllFolders(db).then((actual) => {
				expect(actual).to.eql([]);
			});
		});

		/*we can verify that it creates a new article with a date we specify. 
		   The method should also return the newly created article, including the id*/
		it(`postFolder() inserts an folder and resolves the folder with an 'id'`, () => {
			const folder = {
				title: 'Test new title',
				date_published: new Date('2020-01-01T00:00:00.000Z')
			};

			return NotfulServices.postFolder(db, folder).then((actual) => {
				expect(actual).to.eql({
					id: 1,
					title: folder.title,
					date_published: new Date(folder.date_published)
				});
			});
		});
	});
});
