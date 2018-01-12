import { Ingredient } from '../shared/ingredient.model'
import {Subject} from "rxjs";

export class ShoppingListService {
    ingredientChanged = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        return [...this.ingredients]
    }

    addIngredient(ingredient: Ingredient) {
        this.added(ingredient);
        this.ingredientChanged.next(this.getIngredients());
    }

    addIngredients(ingredients: Ingredient[]) {
        // this.ingredients.push(...ingredients);
        ingredients.forEach((item: Ingredient) => {
           this.added(item);
        });
        this.ingredientChanged.next(this.getIngredients());
    }

    added(ingredient: Ingredient) {
        const exist = this.ingredients
            .find((item: Ingredient) =>  {
                return item.name.toLowerCase() === ingredient.name.toLowerCase()
            });

        if (exist) {
            exist.amount += +ingredient.amount;
            return ;
        }

        this.ingredients.push(ingredient);
    }
}