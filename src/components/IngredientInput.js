import React, { Component } from 'react';
//#B02E0C;
class IngredientInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialVal
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange = (e) => this.setState({value: e.target.value})
    render() {
        return (
            !this.props.isTitle
                ? <div className='inputHolder' id={this.props.idx} ref={(node) => this.divNode = node}>
                    <input  ref={(node) => this.inpNode = node}
                            onKeyDown={(e) => this.props.handleKeyDown(e, this.inpNode, this.divNode)} 
                            id={this.props.idx} 
                            className='ingredientInput' 
                            onChange={this.handleChange} 
                            placeholder={this.props.placeholder}
                            value={this.state.value}/>
                    <button onClick={() => this.props.deleteInput(this.props.idx, this.inpNode)} className='deleteRecipe'>&times;</button>      
                </div>
                : <div className='inputHolder' id={this.props.idx}>
                    <input  ref={(node) => this.inpNode = node}
                            onKeyDown={(e) => this.props.handleKeyDown(e, this.inpNode)} 
                            id={this.props.idx} 
                            className='ingredientInput' 
                            onChange={this.handleChange} 
                            placeholder={this.props.placeholder}
                            value={this.state.value}/>
                </div>
        )
    }
}

export default class IngredientsInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numInputs: 1
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.inputGenerator = this.inputGenerator.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.setEditedRecipe = this.setEditedRecipe.bind(this);
        this.deleteInput = this.deleteInput.bind(this);
    }

    deleteInput = (idx, node) => {
        //console.log(node.parentNode.parentNode.childNodes[0]);
        let [...inpNodes] = node.parentNode.parentNode.childNodes;
        let ingNodes = inpNodes.map(node => node.firstChild)
                               .filter(node => node.className === 'ingredientInput' 
                                            && node.value != false);
        ingNodes.forEach((el) => {
            if(idx === parseInt(el.id, 10)) {
                el.parentNode.remove();
            }
        });
    }

    setEditedRecipe = (key, value) => {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
    }

    handleKeyDown = (e, node, divNode) => {
        if(e.keyCode === 13) {
            e.preventDefault();
            if(parseInt(e.target.id, 10) + 1 === this.state.numInputs) {
                this.setState({
                    numInputs: ++this.state.numInputs
                }, () => node.nextElementSibling && focusNextBox(node));
            }else if(!this.props.new) {
                let lastFormChild = e.target.parentNode.parentNode.lastChild;
                let length = e.target.parentNode.parentNode.childNodes.length;
                this.setState({
                    numInputs: ++length
                }, () => node.nextElementSibling && focusNextBox(node));
            }
            this.forceUpdate();
        }
        function focusNextBox(element) {
            //console.log(element.parentNode.nextElementSibling.firstChild);
            return element.parentNode.nextElementSibling.firstChild 
                            && element.parentNode.nextElementSibling.firstChild.focus()
        }        
    }

    handleButtonClick = (e, node) => {
        e.preventDefault();
        let [...inpNodes] = node.parentNode.childNodes;
        let title = inpNodes[1].firstChild.value;
        let [...formChildNodes] = inpNodes[3].childNodes;
        let ingNodes = formChildNodes.map(el => el.firstChild);
        let ingredientsStr = ingNodes.filter(node => node.className === 'ingredientInput' && node.value != false)
                                     .map(inpTag => inpTag.value)
                                     .join(',');
        if(!this.props.new) {
            this.props.toggleEdit();
            if(title !== 'Spaghetti' && title !== 'Cereal') {
                this.setEditedRecipe(title, ingredientsStr);
                this.props.setCurrentRecipe(title);                
            }else {
                this.props.changeInitialRecipe(title, ingredientsStr);
                this.props.setCurrentRecipe(title);
            }
        }else {
            this.props.saveRecipeOnLocal(title, ingredientsStr);
            this.props.setCurrentRecipe(title);            
        }
    }    

    inputGenerator = (num) => (isNew) => {
        let arr = [];
        if(isNew) {
            for(let i = 0; i < num; i++) {
                arr.push(<IngredientInput isTitle={false} deleteInput={this.deleteInput} initialVal='' placeholder='Enter Ingredient Here' key={i} idx={i} handleKeyDown={this.handleKeyDown}/>)
            }
        }else {
            let recipeStr = localStorage.getItem(this.props.currentRecipe);
            let recipeArr = recipeStr.split(',');
            arr = recipeArr.map((el, idx) => <IngredientInput isTitle={false} deleteInput={this.deleteInput} placeholder='Enter Ingredient Here' key={idx} idx={idx} handleKeyDown={this.handleKeyDown} initialVal={el}/>);
        }
        return arr;
    }
// get ingredients of current recipe and make <IngredientInput/> components with each
// 
    render() {
        return (
            this.props.new 
                ?   <div>
                        <h2>Recipe Name:</h2>
                        <IngredientInput isTitle={true} deleteInput={this.deleteInput} placeholder='Enter Recipe Title' handleKeyDown={this.handleKeyDown}/>
                        <h2>Ingredients:</h2>
                        <form onSubmit={(e) => e.preventDefault()} className='ingredientsForm' ref={(node) => this.formNode = node}>
                            {this.inputGenerator(this.state.numInputs)(true)}
                            <button className='ingredientsSubmitButton' type='submit' onClick={(e) => this.handleButtonClick(e, this.formNode)} >Create Recipe!</button>
                        </form>                
                    </div>
                : <div>
                    <h2>Recipe Name:</h2>
                    <IngredientInput isTitle={true} initialVal={this.props.currentRecipe} placeholder='Enter Recipe Title' handleKeyDown={this.handleKeyDown}/>
                    <h2>Ingredients</h2>
                        <form onSubmit={(e) => e.preventDefault()} className='ingredientsForm' ref={(node) => this.formNode = node}>
                            {this.inputGenerator(this.state.numInputs)(false)}
                            {this.inputGenerator(this.state.numInputs -localStorage.getItem(this.props.currentRecipe).split(',').length)(true)}
                        </form>
                        <button className='ingredientsSubmitButton' type='submit' onClick={(e) => this.handleButtonClick(e, this.formNode)} >Set Recipe</button>                       
                  </div>

        )
    }
}

