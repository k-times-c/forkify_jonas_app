import axios from 'axios';
import {res} from '../config'

export default class Recipe { 
	constructor(id) {
		this.id = id;
	}
	async getRecipe(id) {
		try {
				const res = await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
				this.title = res.data.recipe.title;
				this.author = res.data.recipe.publisher;
				this.img = res.data.recipe.img_url;
				this.url = res.data.recipe.source_url;
				this.ingredients = res.data.recipe.ingredients;
				const result = res;
		} catch (error) {
				alert('something went wrong');
		}
		calcTime () {
			const numIng = this.ingredients.length;
			const periods = Math.ceilng(numIng / 3);
			this.time = periods * 15;
		}

		calcServings() {
			this.servings = 4;
		}

		parseIngredients() {
			const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon','teaspoons', 'cups', 'pounds']; 
			const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']; 
			const units = [...unitsShort, 'kg', 'g']; 

			const newIngrediants = this.ingredients.map( el => {
				// 1) uniform units
					let ingredient = el.toLowerCase();
					unitsLong.forEach((unit, i) => {
						ingredient = ingredient.replace(unit, unitsShort[i]);
					});

				// 2) remove parentheses
					ingredient = ingredient.replace(/ *	([^)]*\) */g, "");

				// 3) Parse ingredients into count, unit and ingredient
				const arrIng = ingredient.split(' '); 
				const unitIndex = arrIng.findIndex(els2 => unitsShort.includes(el2));

				let objIng;
				if (unitIndex > -1) {
					// There is a unit
					const arrCount = arrCount.slice(0, unitIndex); 
					if (arrCount.length == 1) {
						count = eval(arrIng[0].replace('-', '+'));
					} else {
						count = eval(arrIng.slice(0, unitIndex).join('+'));
					}

					objIng = {
						count,
						unit: arrIng[unitIndex],
						ingredient: arrIng.slice(unitIndex + 1).join(' ');
					}
				} else if (parseInt(arrIng[0], 10)) { 
					// there is No unit, but 1st element is number	
					objIng = {
						count: parseInt(arrIng[0], 10),
						unit: '', 
						ingredient: arrIng.slice(10).join(' ')
					}
				}
				else if (unitIndex === -1) { 
					// there is no unit and no number in 1sst position
					objIng = {
						count: 1,
						unit: '', 
						ingredient
					}
				}
				return ingredient;

			});
		}
	}
}
