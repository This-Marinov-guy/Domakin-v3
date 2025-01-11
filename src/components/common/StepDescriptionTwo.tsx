import React from "react";

interface StepDetailsProps {
  details: {
    title: string;
    description?: string[];
    steps: {
      title: string;
      image: string;
      text: string;
    }[];
  };
}

const StepDescriptionTwo = (props: StepDetailsProps) => {
  const { details } = props;

  return (
    <div className="container row m-a">
      <div className="gx-lg-5 align-items-center mt-20 lg-mt-50">
        <div className="col-lg-12">
          <div className=" mt-40 wow fadeInUp">
            <div className="bg-wrapper">
              <h4 className="mb-20 text-center">{details.title}</h4>
              {details?.description &&
                details.description.map((d: string, i: number) => (
                  <p key={i} className="text-center mb-5">
                    {d}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="row gx-xl-5">
            {details.steps.map((d, i) => (
              <div
                key={i}
                className="col-md-4 d-flex flex-column align-items-center justify-content-center"
              >
                <img className="img-5" src={d.image} />
                <h5 style={{ maxWidth: "15em" }}>{d.title}</h5>
                <p style={{ textAlign: 'center' }}>{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDescriptionTwo;
