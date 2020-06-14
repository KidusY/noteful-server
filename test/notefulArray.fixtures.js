const makeTestFolders = () => [
	{
		id: 1,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'First test post!'
	},
	{
		id: 2,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'second test post!'
	},
	{
		id: 3,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'third test post!'
	},
	{
		id: 4,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'Fourth test post!'
	}
];

const makeTestNotes = () => [
	{
		id: 1,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'First test Note!',
		folder: 2,
		content:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
	},
	{
		id: 2,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'second test Note!',
		folder: 2,
		content:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
	},
	{
		id: 3,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'third test Note!',
		folder: 1,
		content:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
	},
	{
		id: 4,
		date_published: '2029-01-22T16:28:32.615Z',
		title: 'Fourth test Note!',
		folder: 3,
		content:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
	}
];

module.exports = {
	makeTestFolders,
	makeTestNotes
};
