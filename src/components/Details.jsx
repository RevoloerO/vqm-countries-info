const Details = ({ icon, title, info }) => (
  <div className="details-row">
    <span className="details-icon">{icon}</span>
    <span className="details-title"><u>{title}</u>:</span>
    <span className="details-info">{info}</span>
  </div>
);

export default Details;
