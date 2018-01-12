import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, Data} from "@angular/router";
import {Ingredient} from "../../shared/ingredient.model";
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

    recipe: Recipe;
    editMode: boolean = false;
    recipeForm: FormGroup;

    constructor(private recipeService: RecipeService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router) {
    }

    onInitFormBuilder() {
        this.recipeForm = new FormGroup({
            'name': new FormControl(null, [Validators.required]),
            'description': new FormControl(null, [Validators.required]),
            'imagePath': new FormControl(null, [Validators.required]),
            'ingredients': new FormArray([])
        });
    }

    ngOnInit() {
        this.onInitFormBuilder();
        this.route.data
            .subscribe(
                (data: Data) => {
                    this.editMode = data['recipe'] instanceof Recipe;
                    this.recipe = this.editMode ? data['recipe'] : this.initRecipe();
                    if (this.editMode) {
                        this.populateRecipe();
                    } else {
                        this.addIngredient();
                    }
                }
            );
    }

    initRecipe() {
        return new Recipe(this.recipeService.generateId(), '', '', '', []);
    }

    populateRecipe() {
        (<FormControl>this.recipeForm.controls['name']).patchValue(this.recipe.name);
        (<FormControl>this.recipeForm.controls['description']).patchValue(this.recipe.description);
        (<FormControl>this.recipeForm.controls['imagePath']).patchValue(this.recipe.imagePath);
        // this.removeIngredient(0);
        this.recipe.ingredients.forEach((ingredient: Ingredient) => this.addIngredient(ingredient));
    }

    initIngredient(ingredient?: Ingredient): FormGroup {
        const name = (ingredient) ? ingredient.name : null;
        const amount = (ingredient) ? ingredient.amount : 0;
        // add address to the list
        return this.formBuilder.group({
            'name': new FormControl(name, [Validators.required]),
            'amount': new FormControl(+amount, [Validators.required])
        });
    }

    addIngredient(ingredient?: Ingredient) {
        // add ingredient to the list
        this.getIngredientFormArray().push(this.initIngredient(ingredient));
        if (!ingredient) {
            this.recipe.ingredients.push(new Ingredient('', 0));
        }

    }

    removeIngredient(i: number) {
        // remove ingredient from the list
        this.getIngredientFormArray().removeAt(i);
        this.recipe.ingredients.splice(i, 1)
    }

    private getIngredientFormArray(): FormArray {
        return <FormArray>this.recipeForm.controls['ingredients'];
    }

    onSubmit() {
        if (this.editMode) {
            this.recipeService.update(this.recipe)
        } else {
            this.recipeService.add(this.recipe)
        }
        this.router.navigate(['../recipes', this.recipe.id])
    }

}
