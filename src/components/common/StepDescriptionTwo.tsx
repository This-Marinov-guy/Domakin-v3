import React from "react";

interface StepDetailsProps {
  details: {
    title: string;
    description?: string[];
    steps: {
      icon: string;
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
              {details?.description && details.description.map(
                (d: string, i: number) => (
                  <React.Fragment key={i}>
                    <p className="text-left mb-5">{d}</p>
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="row gx-xl-5">
            {details.steps.map((d, i) => (
              <div key={i} className="m-a col-md-4 ">
                <div className="card-style-four mt-40 wow fadeInUp">
                  <div className="d-flex align-items-start justify-content-start gap-3">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center position-relative style-two">
                      <i className={`${d.icon}`} />
                    </div>
                    <h6 style={{ maxWidth: "15em" }}>{d.text}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDescriptionTwo;
