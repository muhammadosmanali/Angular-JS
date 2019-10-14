import {Recipe} from './recipe.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  constructor(private shoppingListService: ShoppingListService) {}
  private recipes: Recipe[] = [
    new Recipe('A Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
      ]),
    new Recipe('Another Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Buns', 1),
        new Ingredient('Meat', 20),
      ])
  ];

  getRecipe() {
    return this.recipes.slice();
  }

  getRecipes(id: number) {
    return this.recipes[id];
  }

  addToIngredientList(ingredient: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredient);
  }
}
