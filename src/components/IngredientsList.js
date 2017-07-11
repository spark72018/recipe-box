import React, {Component} from 'react';

function IngredientsList(props) {
    return (
        <ul className='recipeList'>
            {props.recipeString.split(',').map((el, idx) => <li key={idx}>{el}</li>)}
        </ul>            
    )
}

export default IngredientsList;