import { AMENITIES_LIST } from "@/utils/defines";

const SelectAmenities = () => {
   return (
      <div className="bg-white card-box border-20 mt-40">
         <h4 className="dash-title-three m0 pb-5">Select Amenities</h4>
         <ul className="style-none d-flex flex-wrap filter-input">
            {AMENITIES_LIST.map((label, id) => (
               <li key={id}>
                  <input type="checkbox" name="Amenities" value={id} />
                  <label>{label}</label>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default SelectAmenities
