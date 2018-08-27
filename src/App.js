import React, { Component } from 'react';
import RecipeTitle from './components/RecipeTitle';
import IngredientsList from './components/IngredientsList';
import IngredientInput from './components/IngredientInput';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      editMode: false,
      currentRecipe: '',
      editedRecipe: '',
      recipes: [
        {
          Spaghetti: 'pasta,water,tomato sauce,salt'
        },
        {
          Cereal: 'cereal,milk'
        }
      ]
    }
    this.saveRecipeOnLocal = this.saveRecipeOnLocal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.localStorageIterator = this.localStorageIterator.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.changeInitialRecipe = this.changeInitialRecipe.bind(this);
  }

  setEditedRecipe = (str) => this.setState({editedRecipe: str});

  setCurrentRecipe = (str) => this.setState({currentRecipe: str});

  handleClick(e) {
    e.preventDefault();
    let targetId = e.target.id;
    let currentRecipe = this.state.currentRecipe;
    if(!currentRecipe || currentRecipe !== e.target.id) {
      this.setState({
        currentRecipe: targetId
      });
    }else if(currentRecipe === e.target.id) {
      this.setState({
        currentRecipe: ''
      });
    }
    if(this.state.editMode) {
      return this.setState({editMode: false});
    }
  }

  changeInitialRecipe = (recipeName, recipeStr) => {
    let [spaghetti, cereal] = this.state.recipes;
    var newArr;
    if(recipeName === 'Spaghetti') {
      spaghetti[recipeName] = recipeStr;
    }else if(recipeName === 'Cereal') {
      cereal[recipeName] = recipeStr;
    }else {
      return console.log('Can only change one of the initial recipes! (Spaghetti, or Cereal)');
    }
    newArr = [spaghetti, cereal];
    return this.setState({
      recipes: newArr
    });
  }

  saveRecipeOnLocal = (key, value) => {
    localStorage.setItem(key, value);
    return null;
  }

  setNumRecipes = (num) => this.setState({numRecipes: num})
  deleteRecipe = (key) => (num) => {
    for(let i = 0; i < num; i++) {
      if(localStorage.key(i) === key) {
        localStorage.removeItem(key);
      }
    }
    this.setCurrentRecipe('');
  }
  localStorageIterator = (num) => (Component, propsObj) => (isTitle) => {
    let resultArr = [];
    if(isTitle) {
      for(let i = 0; i < num; i++) {
        let propObj = {
          title: localStorage.key(i),
          handleClick: this.handleClick
        };
        resultArr.push(<Component key={i} {...propObj}/>);
      }
    }else {
      for(let i = 0; i < num; i++) {
        if(localStorage.key(i) === this.state.currentRecipe) {
          let recipeString = localStorage.getItem(localStorage.key(i));
          if(!this.state.editMode) { // is not edit mode
            return <div className='recipeBox'>
                <IngredientsList recipeString={recipeString}/>
                <button className='ingredientsSubmitButton' 
                        onClick={(e) => this.toggleEdit(e)} 
                        type='button'>{!this.state.editMode
                                            ? 'Edit Recipe'
                                            : 'Set Recipe'}</button>
                <button className='ingredientsSubmitButton' 
                        onClick={() => this.setCurrentRecipe('')} 
                        type='button'>New Recipe</button>
                <button className='ingredientsSubmitButton' 
                        onClick={() => this.deleteRecipe(this.state.currentRecipe)(localStorage.length)} 
                        type='button'>Delete Recipe</button>
            </div>    
          }else { // is edit mode
            return <div>
                  <IngredientInput new={false}
                                   currentRecipe={this.state.currentRecipe}
                                   saveRecipeOnLocal={this.saveRecipeOnLocal}
                                   setCurrentRecipe={this.setCurrentRecipe}
                                   setEditedRecipe={this.setEditedRecipe}
                                   toggleEdit={this.toggleEdit}
                                   changeInitialRecipe={this.changeInitialRecipe}/>
              </div>
          }      
        }
      }
    }
    return resultArr;
  }

  toggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  render() {
    return (
      <div className='mainContainer'>
        <h1 id='title'>Recipe Box</h1>
        <div className='innerContainer'>
          <div className='recipeContainer'>
            {this.state.recipes.forEach((obj) => {
              for(let key in obj) {
                this.saveRecipeOnLocal(key, obj[key]);
              }
            })}
            {this.localStorageIterator(localStorage.length)(RecipeTitle)(true)}
          </div>
          <div className='mainDisplay'>
            {!this.state.currentRecipe 
                ? <IngredientInput saveRecipeOnLocal={this.saveRecipeOnLocal}
                                   setCurrentRecipe={this.setCurrentRecipe}
                                   new={true}/>
                : !this.state.editMode 
                    ? this.localStorageIterator(localStorage.length)(IngredientsList)(false)
                    : this.localStorageIterator(localStorage.length)(IngredientInput)(false) 
            }
          </div>                  
        </div>
      </div>
    );
  }
}

export default App;
