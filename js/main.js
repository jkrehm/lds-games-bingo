var bingo = {
	store: Modernizr.localstorage && true,
	letters: ['a','b','c','d','e','f','g'],
	cards: [],
	size: 5,
	grid: [],

	inititalize: function() {
		var url = $.url();

		// Show print version
		if (url.param('print') == 'y') {
			$('.no-print').hide();
		};

		// Get board size from local storage
		if (bingo.store && localStorage.getItem('bingo_board_size') !== null) {
			bingo.size = localStorage.getItem('bingo_board_size');
		};

		// Get board size from query string
		if (_.indexOf([3,5], Number(url.param('size')), true) > -1) {
			bingo.size = Number(url.param('size'));
		};

		$('[id="board_size_'+bingo.size+'"]').attr('checked', true);

		bingo.generate();
	},

	createNew: function(params) {
		$.extend(bingo, params);

		if (bingo.store) {
			localStorage.removeItem('bingo_cards');
			localStorage.setItem('bingo_board_size', bingo.size);
		}

		bingo.getCards();
	},

	getCards: function() {
		if (!bingo.store || localStorage.getItem('bingo_cards') === null) {

			$.getJSON('bingo.json', function(data) {
				var x = Math.floor(bingo.size/2),
					center = bingo.size * x + x;

				bingo.cards = _.shuffle(data.cards);

				// Put Christ at the center
				bingo.cards[center] = {
					text: 'Jesus Christ',
					image: 'jesus_christ.png',
					selected: false
				};

				if (bingo.store) {
					localStorage.setItem('bingo_cards', JSON.stringify(bingo.cards));
				}

				bingo.generate();
			});

		} else {

			bingo.cards = JSON.parse(localStorage.getItem('bingo_cards'));

			bingo.generate();

		}
	},

	generate: function() {
		$('.bingo-board-wrapper').hide();

		if (bingo.cards.length === 0) {
			bingo.getCards();

			return true;
		};

		var grid_letter = bingo.getGridLetter(),
			html = '<div class="bingo-board ui-grid-'+grid_letter+'">'+"\n",
			k = 0,
			selected;

		for (var i = 0; i < bingo.size; i++) {
			bingo.grid[i] = new Array(new Array());

			for (var j = 0; j < bingo.size; j++) {

				selected = bingo.cards[k].selected ? ' block-selected' : '';

				html += '<a href="#" class="ui-block-'+bingo.letters[j]+selected+'" data-position="'+j+'x'+i+'">'+"\n";
				html += '<img src="img/bingo/'+bingo.cards[k].image+'"/>'+"\n";
				html += '<div class="card-text">'+bingo.cards[k].text+'</div>'+"\n";
				html += '</a>'+"\n";

				bingo.grid[i][j] = bingo.cards[k++];
				bingo.grid[i][j].selectable = true;
			};
		};

		html += '<div class="clearfix"></div></div>';

		$('.bingo-board-wrapper').html(html).imagesLoaded(function() {
			$(this).show();
		});
	},

	getGridLetter: function() {
		var index = bingo.size - 3;

		if (index > 0) {
			index /= 2;
		};

		return bingo.letters[index];
	},

	selectBlock: function(block) {
		var x, y, id, position;

		position = $(block).data('position').split('x');
		x = Number(position[0]);
		y = Number(position[1]);

		if (!bingo.grid[y][x].selectable) {
			return;
		};

		if (bingo.grid[y][x].selected) {
			$(block).removeClass('block-selected');
		} else {
			$(block).addClass('block-selected');
		};

		bingo.grid[y][x].selected = !bingo.grid[y][x].selected;

		if (bingo.store) {
			localStorage.setItem('bingo_cards', JSON.stringify(bingo.cards));
		}

		bingo.checkForBingo(x, y);
	},

	checkForBingo: function(x, y) {
		if (bingo.checkDown(x) || bingo.checkAcross(y) || bingo.checkDiagonal(x, y)) {
			bingo.bingo();
		};
	},

	checkDown: function(x) {
		for (var i = 0; i < bingo.size; i++) {
			if (!bingo.grid[i][x].selected) {
				return false;
			};
		}

		return true;
	},

	checkAcross: function(y) {
		for (var i = 0; i < bingo.size; i++) {
			if (!bingo.grid[y][i].selected) {
				return false;
			};
		}

		return true;
	},

	checkDiagonal: function(x, y) {
		if (x !== y && x !== (bingo.size-1-y)) {
			return false;
		};

		for (var i = 0; i < bingo.size; i++) {

			left_right = (x === y && !bingo.grid[i][i].selected);
			right_left = (x !== y && !bingo.grid[bingo.size-1-i][i].selected);

			if (left_right || right_left) {
				return false;
			}
		}

		return true;
	},

	bingo: function() {
		alert('Bingo!');
	}
};

$(document).ready(function() {
	bingo.inititalize();

	// Create new board
	$('#make_board').click(function() {
		bingo.createNew({
			size: $('[name="size"]:checked').val()
		});

		return false;
	});

	// Select card
	$(document).on('click', '[class^="ui-block"]', function() {
		bingo.selectBlock(this);

		return false;
	});
});
