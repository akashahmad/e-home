import "../index.css";
import LocationIcon from "../../../assets/wizardImages/iconfinder-tilda-icons-1-ed-location-3586361@3x.png";
import BedIcon from "../../../assets/wizardImages/iconfinder-double-bed-3512844-copy@3x.png";
import BedBath from "../../../assets/wizardImages/iconfinder-bathtub-3512826-copy@3x.png";
import IconFinder from "../../../assets/wizardImages/2683934-200-copy@3x.png";
import IconFoot from "../../../assets/wizardImages/2683934-200-copy@3x.png";
import { useHistory } from "react-router-dom";
const Index = () => {
  let history = useHistory();

  const detailHandler = (props) => {};
  return (
    <div className="card">
      {/* <!-- background Image --> */}
      <div className="background_image">
        <div className="d-flex justify-content-between px-3 py-4">
          {/* <!-- left --> */}
          <div>
            <button type="submit" className="btn btn-primary px-3 py-1">
              SALE
            </button>
          </div>
          {/* <!-- right --> */}
          <div className="days_detail">
            <h4 className="px-1 py-2 m-0">10 Days Ago</h4>
          </div>
        </div>
      </div>
      <div className="card-body">
        {/* <!-- name and price --> */}
        <div className="name_price_container d-flex justify-content-between py-3">
          <h2 className="m-0 font-weight-bold">Delaware Twp.,</h2>
          <h2 className="m-0 font-weight-bold">$435,000</h2>
        </div>
        {/* <!-- image and content --> */}
        <div className="address_image d-flex">
          <img src={LocationIcon} />
          <p className="font-weight-bold m-0 px-3">
            117 SANDBROOK HQTS RD Delaware Twp., NJ 08559
          </p>
        </div>
        {/* <!-- icons and discription --> */}
        <div className="icon_discription_container d-flex justify-content-around py-3">
          {/* <!-- 1st box --> */}
          <div className="box_container px-3 py-2">
            <div className="d-flex justify-content-center">
              <img src={BedIcon} />
            </div>
            <p className="font-weight-bold text-center py-2 m-0">3 Bed</p>
          </div>
          {/* <!-- 2nd --> */}
          <div className="box_container px-3 py-2">
            <div className="d-flex justify-content-center">
              <img src={BedBath} />
            </div>
            <p className="font-weight-bold text-center py-2 m-0">2 Bath</p>
          </div>
          {/* <!-- 3rd --> */}
          <div className="box_container px-3 py-2">
            <div className="d-flex justify-content-center">
              <img src={IconFoot} />
            </div>
            <p className="font-weight-bold text-center py-2 m-0">18295 ft</p>
          </div>
        </div>
        {/* <!-- icon and button --> */}
        <div className="d-flex justify-content-between align-items-center py-2">
          <div className="address_image d-flex pl-5">
            <img src={IconFinder} />
            <p className="font-weight-bold m-0 px-3">Christine Muse</p>
          </div>
          <div className="card_detail_button">
            <button
              type="submit"
              className="btn btn-primary px-3 py-1"
              onClick={() => detailHandler()}
            >
              SEE DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
