import useTranslation from "next-translate/useTranslation";
import {
  AMENITY_OPTIONS,
  getAmenityLabel,
  getAmenityLabelKey,
  getTranslatedEnum,
} from "@/utils/defines";

const SelectAmenities = () => {
   const { t } = useTranslation("translations");
   return (
      <div className="bg-white card-box border-20 mt-40">
         <h4 className="dash-title-three m0 pb-5">Select Amenities</h4>
         <ul className="style-none d-flex flex-wrap filter-input">
            {AMENITY_OPTIONS.map(({ id }) => (
               <li key={id}>
                  <input type="checkbox" name="Amenities" value={id} />
                  <label>{getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id))}</label>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default SelectAmenities
