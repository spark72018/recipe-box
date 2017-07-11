import React, {Component} from 'react';

function RecipeTitle(props) {
    return (
        <div className='recipe'>
            <a onClick={props.handleClick} id={props.title} href=''>{props.title}</a>
        </div>
    )
}

export default RecipeTitle;