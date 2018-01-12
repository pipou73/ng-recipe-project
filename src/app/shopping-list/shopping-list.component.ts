import {Component, OnInit, OnDestroy} from '@angular/core';
import { Ingredient } from '../shared/ingredient.model'
import { ShoppingListService } from "./shopping-list.service";
import {Subscription} from "rxjs";
import {RecipeService} from "../recipes/recipe.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  recipes: recipe[] = [];
  ingredientSelected: Ingredient;
  private subscription: Subscription;

  constructor(
      private slService : ShoppingListService,
      private slRecipe: RecipeService
  ) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients()
    this.subscription = this.slService.ingredientChanged
        .subscribe((ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectedIngredient(ingredient: Ingredient) {
    this.ingredientSelected = ingredient;
    this.recipes = this.slRecipe.getRecipesByIngredient(ingredient);
  }
}
