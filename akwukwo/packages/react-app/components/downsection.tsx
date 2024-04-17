import React from "react";
// import celoSvg from "../assests/images/celo_isotype.svg";

const FooterSection: React.FC = () => {
  return (
    <section>
      <div className="sm:container sm:m-auto pb-10 pt-20 mx-6">
        <div className="grid grid-cols-footer">
          <div className="col-start-1 col-end-6 md:col-start-auto md:col-end-auto">
            <h1>Powered by Klatyn</h1>
            {/* <img
              width="100px"
              src="https://alfajores.celoscan.io/images/svg/brands/main.svg?v=23.8.2.0"
              alt="Celo"
              className="mb-11 md:mb-0"
            /> */}
          </div>
          <div className="col-start-1 col-end-6 md:col-start-auto md:col-end-auto">
            <h1> and Hackerx</h1>
            {/* <img
              width="100px"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTNXUtcigVez4a4Sr_qLhztBdAJIyWDC5fK0j1aiSXGapxawsIJoy1q8G5maLYrL14Y6g&usqp=CAU"
              alt="Bunzz"
              className="mb-11 md:mb-0"
            /> */}
          </div>

          <div className="mb-11 md:mb-0">
            <h6 className="text-gray font-sfProRegular text-xs pb-4">
              Explore the world of digital possibilities
            </h6>
            <div className="inline-flex flex-col gap-3">
              {/* Other product links */}
            </div>
          </div>
          <div className="col-start-3 col-end-6 md:col-start-auto md:col-end-auto">
            <h6 className="text-gray font-sfProRegular text-xs pb-4">
              DOCUMENTATION
            </h6>
            <div className="inline-flex flex-col gap-3">
              <a
                className="font-sfProRegular text-black text-sm block hover:underline"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Verified Contract Link
              </a>
              <a
                className="font-sfProRegular text-black text-sm block hover:underline"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us
              </a>
              {/* Other documentation links */}
            </div>
          </div>
          <div>{/* GitHub and social media links */}</div>
        </div>
      </div>
      <div className="border-t border-borderColor py-6 flex justify-center">
        {/* <p className="font-sfProRegular text-black text-xs pr-5">
          © 2023 Akwukwo. All rights reserved.
        </p> */}
      </div>
    </section>
  );
};

export default FooterSection;
