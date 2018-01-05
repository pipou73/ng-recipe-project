import {Component, OnInit, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @Output() ingredientAdded = new EventEmitter<{name: string, amount: number}>()
  @Output() ingredientAdded = new EventEmitter<Ingredient>()
  @ViewChild('nameInput') nameInputRef = ElementRef;
  @ViewChild('amountInput') amountInputRef = ElementRef;

  constructor(private slService: ShoppingListService ) { }

  ngOnInit() {}

  onAddItem() {
    if (this.nameInputRef instanceof ElementRef && this.nameInputRef.nativeElement) {
      const ingName = this.nameInputRef.nativeElement.value;
      const ingAmount = this.amountInputRef.nativeElement.value;
      const newIngredient = new Ingredient(ingName, ingAmount)
      this.slService.addIngredient(newIngredient);
    }
  }
}
