import React from "react";
import "./About.css";

const About = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <h1 id="about" className="text-3xl font-semibold text-center mx-auto pt-10">
        About YourHealthCo
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
        Delivering quality healthcare with compassion, technology, and a
        patient-first approach.
      </p>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16">
        <div className="size-[520px] rounded-full absolute blur-[300px] -z-10 bg-[#E6F0FF]"></div>

        <div>
          <h2 className="text-3xl font-semibold">Why Choose Us?</h2>
          <p className="text-sm text-slate-500 mt-2">
            YourHealthCo is committed to providing high-quality,
            patient-centered healthcare. With experienced professionals and
            state-of-the-art facilities, we ensure personalized care tailored to
            every individual.
          </p>

          <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-center gap-4">
              <div className="size-9 p-2 bg-blue-50 border border-blue-200 rounded">
                <span>✅</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  Experienced & Certified Doctors
                </h3>
                <p className="text-sm text-slate-500">
                  A trusted team dedicated to your health.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-9 p-2 bg-blue-50 border border-blue-200 rounded">
                <span>🏥</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  State-of-the-Art Facilities
                </h3>
                <p className="text-sm text-slate-500">
                  Modern equipment ensuring precise care.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-9 p-2 bg-blue-50 border border-blue-200 rounded">
                <span>💙</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  Patient-Centered Approach
                </h3>
                <p className="text-sm text-slate-500">
                  We put your comfort and needs first.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-9 p-2 bg-blue-50 border border-blue-200 rounded">
                <span>📅</span>
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-600">
                  Convenient Online Booking
                </h3>
                <p className="text-sm text-slate-500">
                  Book appointments anytime, anywhere.
                </p>
              </div>
            </div>
          </div>

          <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
            Our Story
          </button>
        </div>
      </div>
    </>
  );
};

export default About;
