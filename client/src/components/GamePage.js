import React, { useEffect } from 'react';
import BuildButton from './BuildButton';

const Trade = () => {
  useEffect(() => { 
    const text = document.querySelector('.my-trades').cloneNode(true);
    document.querySelector('.clone').appendChild( document.createElement("div") );
  }, []);

  // const renderTest = () => document.querySelector('.test');

  return (
    <>
      <div class="my-trades">
        <label>
          <input type="checkbox" name="MA" checked />
          <span class="prop-span" style={{ display: "block" }}>
            <img class="card-styling" style={{ backgroundColor: "brown" }} />
            <h class="inv-text-styling"> MA </h>
          </span>
        </label>
      </div>
      <div className="clone"></div>
    </>
  );
}

export default Trade;