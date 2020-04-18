import axios from 'axios';
import {res} from '../config'

export default class Search { 
	constructor(query) {
		this.query = query;
	}
	async getResults(query) {
		try {
				const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
				const result = res.data.recipes;
				console.log(result)
		} catch (error) {
				alert(error)
		}
	}
}
