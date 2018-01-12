import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {RecipeService} from "./recipe.service";
import {Observable} from "rxjs";
import {Recipe} from "./recipe.model";

@Injectable()
export class RecipeResolverService implements Resolve<Recipe> {
    constructor(
        private recipeService: RecipeService,
        private router: Router,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Recipe> | Promise<Recipe> | Recipe {
            console.log(route.params)
        const recipe = this.recipeService.getRecipe(+route.params['id']);
        if (!recipe) {
            this.router.navigate(['recipes']);
        }

        return recipe;
    }
}