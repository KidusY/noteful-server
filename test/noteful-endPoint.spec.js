const { expect } = require('chai');
const knex = require('knex');
const config = require('../src/config');
const { makeTestFolders, makeTestNotes } = require('./notefulArray.fixtures');
const app = require('../src/app');

describe('Noteful Endpoints', function() {
	let db;
	before('Make connection to the database', () => {
		db = knex({
			client: 'pg',
			connection: config.TEST_DB_CONNECTION
		});

		app.set('db', db);
	});
	before('clean the table', () => db('folders').truncate());

	after('Disconnect from the db', () => db.destroy());

	afterEach('clean up after each test', () => db('folders').truncate());

	context(`Given no folder`, () => {
		it(`responds with 200 and an empty list`, () => {
			return supertest(app).get('/noteful/folders').expect(200, []);
		});
	});
	context('Given there are folders in the database', () => {
		beforeEach('insert folder', () => {
			return db.into('folders').insert(makeTestFolders());
		});

		it('GET notful/folders responds with 200 and all of the folders', () => {
			return supertest(app).get('/noteful/folders').expect(200, makeTestFolders());
			// TODO: add more assertions about the body
		});
		it('GET /noteful/folders/:id responds with 200 and the specified folder', () => {
			const folderId = 2;
			const expectedFolder = makeTestFolders()[folderId - 1];
			return supertest(app).get(`/noteful/folders/${folderId}`).expect(200, expectedFolder);
		});
		describe(`POST /noteful/folders`, () => {
			it(`responds with 400 and an error message when the 'title' is missing`, () => {
				return supertest(app)
					.post('/noteful/folders')
					.send({
						style: 'Listicle',
						content: 'Test new article content...'
					})
					.expect(400, {
						error: { message: `Missing 'title' in request body` }
					});
			});
		});

		describe(`GET /noteful/folders/:folder_id`, () => {
			context('Given there are articles in the database', () => {
				/* not shown */
			});

			context(`Given an XSS attack folder`, () => {
				const maliciousFolderName = {
					id: 12,
					title: 'Naughty naughty very naughty <script>alert("xss");</script>'
				};
				beforeEach('insert malicious folder', () => {
					return db.into('folders').insert([ maliciousFolderName ]);
				});
				it('removes XSS attack content', () => {
					return supertest(app)
						.get(`/noteful/folders/${maliciousFolderName.id}`)
						.expect(200)
						.expect((res) => {
							expect(res.body.title).to.eql(
								'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
							);
						});
				});
			});
		});
	});

	describe.only(`DELETE //:folder_id`, () => {
		context('Given there are folders in the database', () => {
			testFolders = makeTestFolders();
			beforeEach('insert folder', () => {
				return db.into('folders').insert(testFolders);
			});
			it('responds with 204 and removes the folder', () => {
				const idToRemove = 2;
				const expectedFolders = testFolders.filter((folder) => folder.id !== idToRemove);
				console.log(expectedFolders);
				return supertest(app)
					.delete(`/noteful/folders/${idToRemove}`)
					.expect(204)
					.then((res) => supertest(app).get(`/noteful/folders`).expect(expectedFolders));
            });           

        });
        context(`Given no folders`, () => {
                it(`responds with 404`, () => {
                  const folderId = 123456
                  return supertest(app)
                    .delete(`/noteful/folders/${folderId}`)
                    .expect(404, { error: { message: `Folder Not Found` } })
                })
              })

	});
});
