import axios from 'axios';
import Search from './models/Search';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as ListView from './views/ListView'
import * as LikesView from './views/LikesView'
import { elements } from './views/base'


// Global state of the app 
// - Search object
// - Current recipe object
// - Shopping list object 
// - liked recipes

const state = {};


// **SEARCH CONTROLLER**

const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput();
	console.log(query);

	if (query) {
	// 2) New search object and add to state
		state.search = new Search(query);

	// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4) Search for recipes
			await state.search.getResults();

			// 5) Render results on UI
			clearLoader();
			searchView.renderResults(stat.search.results);
		} catch (err) {
			alert('something went wrong with the get results function');
			clearLoader();
			}
	}
};


elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});


window.searchForm.addEventListener('load', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline'); 
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.results, goToPage);
		console.log(goToPage);
	}
});


//********************//
//**RECIPE CONTROLLER***
//********************//

const controlRecipe = async () => {
	// Get ID from url
	const id = window.location.hash.replace('#', '');
	console.log(id);

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);

		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data and parse ingredient
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);

		} catch (err) {
			alert('Error processing recipe!');
		}
	}
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//********************//
// ***LIST CONTROLLER***
//********************//


const controlList = () => {
	// Create a new list IF there is none yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);

	});
}

// Handle dele and updat list itmes events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.id;

	// Handle the delet button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// Delete from state
		state.list.deleteItem(id);

		// Delete from UI
		listView.deleteItem(id);
		// Handle the count update
	} else if (e.target.matches('shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}

});


//********************//
// ***LIKE CONTROLLER***
//********************//


const controlLike = () => {
	if (!state.likes) state.likes = new Likes();

	const currentID = state.recipe.id; 
	// User has not yet like current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.list.title,
			state.list.author,
			state.list.img
		); 

		// Toggle the like button
		likesView.toggleLikeBtn(true);

		// Add like to UI list
		likesView.renderLike(newLike);

	// User has yet like current recipe
	} else {
		// Remove like to the state
		state.likes.deleteLike(state.likes);

		// Toggle the like button
		likesView.toggleLikeBtn(false);

		// Remove like to UI list
		likesView.deleteLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore like recipes on age load
window.addEventListener('load', () => {
	state.likes = new Likes();

	// Restore likes
	state.likes.readStorage();

	// Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());

	// Render existing likes
	state.likes.likes.forEach(like => likesView.RenderLike(like));
});

// Handling recipe boutton clicks 
elements.recipe.addEventListener('click', e => { 
	if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Decrease button is clicked
		if (state.state.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe_btn--add, .recipe__btn--add *')) {
		// Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) { 
		//Like controller
		controlLike();
	}
});
