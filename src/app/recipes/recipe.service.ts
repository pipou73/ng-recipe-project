import {Recipe} from './recipe.model'
import { Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model'
import {ShoppingListService} from '../shopping-list/shopping-list.service'
import {Observable, Subject, Subscription} from "rxjs";
import {Http, Response, Response} from "@angular/http";
import 'rxjs/Rx'

@Injectable()
export class RecipeService {
    protected baseUrl =  'https://ng4-udemi-course-project.firebaseio.com/data';
    public recipeChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];

    constructor(private http: Http ,private slService: ShoppingListService) {
        this.fetchRecipes();
    }

    responseToRecipe(observable: Observable<Response>): Observable<Recipe[]> | Observable<any> {
        return observable.map((response: Response) => response.json())
                .map((data: any[]) => {
            console.log(data)
                    return data.map(({id, name, description, imagePath, ingredients}) => {
                        return new Recipe(
                            id,
                            name,
                            description,
                            imagePath,
                            ingredients.map(({ name, amount}) => {
                                return new Ingredient(name, amount)
                            }));
                    })
                })
                .catch((error: Response) => {
                    return Observable.throw(error)
                });
    }

    processSubscription(obs :Observable<Recipe[]> | Observable<any>, added: boolean) {
        return obs.subscribe(
            (recipes: Recipe[]) => {
                if (added) {
                    this.recipes = recipes;
                }
                this.recipeChanged.next(this.recipes);
            },
            (error) =>  console.log('error during recipe request ', error)
        );
    }

    getRecipes(): Recipe[] {
        return this.recipes;
    }

    fetchRecipes(): Subscription {
        const obs = this.http.get(this.baseUrl + '.json')
        return this.processSubscription(this.responseToRecipe(obs), true);
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    getRecipe(id: number): Recipe {
        return this.recipes.find((recipe: Recipe) => recipe.id === id);
    }

    update(recipe: Recipe) {
        const index = this.getIndexRecipeById(recipe.id);
        return this.http.put(
            this.baseUrl + '/'+ index +'.json',
            recipe,
            { headers : new Headers({'Content-Type': 'application/json'}) }
        ).subscribe(
            (response: Response) => console.log(response),
            (error)    =>  console.log('error durring update recipe', error)
        );
    }

    add(recipe: Recipe): Observable {
        this.recipes.push(recipe);

        this.recipeChanged.next(this.recipes);
        return this.saveRecipes();
    }

    delete(id: number) {
        const index = this.getIndexRecipeById(id);
        this.recipes.splice(index, 1);
        return this.saveRecipes();
    }

    saveRecipes(): Subscription {
        const obs = this.http.put(
            this.baseUrl + '.json',
            this.recipes,
            { headers : new Headers({'Content-Type': 'application/json'}) }
        );

        return this.processSubscription(obs, false);
    }

    generateId() {
        return Math.round(Math.random() * 10000);
    }


    getRecipesByIngredient(ingredient: Ingredient): Recipe[] {
        return this.recipes.filter((recipe: Recipe) => (recipe.ingredients.includes(ingredient)))
    }

    protected getIndexRecipeById(id: number) {
        return this.recipes.findIndex((recipe: Recipe) => recipe.id === id);
    }
}