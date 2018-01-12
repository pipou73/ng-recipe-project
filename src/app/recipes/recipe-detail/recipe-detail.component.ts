import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from "../recipe.model";
import { RecipeService } from '../recipe.service'
import {ActivatedRoute, Router, Data} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  constructor(
      private recipeService: RecipeService,
      private route: ActivatedRoute,
      private router: Router
  ) { }

    ngOnInit() {
        this.route.data
            .subscribe(
                (data: Data) => {
                    this.recipe = data['recipe']
                }
            )
    }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.router.navigate(['shopping-list'])
  }

  onDelete() {
      this.recipeService.delete(this.recipe.id);
      this.router.navigate(['recipes'])
  }

}
