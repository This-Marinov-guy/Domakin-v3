import PriceRange from '@/components/common/PriceRange';
import React from 'react'

const RangesSelect = (props: any) => {
  const { values, onChange, min, max, symbol = '' } = props;
  
  return (
    <div className="search-wrapper-one">
      <div className="price-ranger mb-10">
        <div className="price-input d-flex align-items-center justify-content-between pt-5">
          <div className="field d-flex align-items-center">{values[0]} {symbol}</div>
          <div className="divider-line"></div>
          <div className="field d-flex align-items-center">{values[1]} {symbol}</div>
        </div>
      </div>
      <PriceRange
        MIN={min}
        MAX={max}
        STEP={100}
        values={values}
        handleChanges={onChange}
      />
    </div>
  );
}

export default RangesSelect