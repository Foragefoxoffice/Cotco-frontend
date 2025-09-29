import React from "react";

const IconBox = ({ children }) => (
  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
    <div className="text-blue-600">{children}</div>
  </div>
);

const PinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s7-5.33 7-11a7 7 0 10-14 0c0 5.67 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" fill="currentColor" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 16.92v2a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.15 8.81 19.79 19.79 0 010.08 0 2 2 0 012.06 0h2a2 2 0 012 1.72c.13.95.35 1.88.66 2.77a2 2 0 01-.45 2.11L5.4 8.6a16 16 0 007 7l2-1.86a2 2 0 012.11-.45 13.07 13.07 0 002.77.66A2 2 0 0122 16.92z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M22 6l-10 7L2 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2l1.5 1.5L9 2l1.5 1.5L12 2l1.5 1.5L15 2l1.5 1.5L18 2v20l-1.5-1.5L15 22l-1.5-1.5L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22V2z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M8.5 8h7M8.5 12h7" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GetinTouch = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto page-width md:pt-20 pt-6">
        {/* Heading */}
        {/* <div className="text-center max-w-3xl mx-auto">
          <h2 className="heading">
            Get In Touch
          </h2>
          <p className="mt-3 text-slate-600 text-lg leading-relaxed">
            We’re here to assist you with any inquiries about our cotton,
            viscose, or<br></br> machinery products.
          </p>
        </div> */}

        {/* Cards */}
        <div className="  grid grid-cols-1 md:grid-cols-2 md:max-w-5xl m-auto gap-6 lg:gap-8">
          {/* Our Office */}
          <div className="rounded-2xl bg-white [box-shadow:rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.06)_0px_1px_2px_0px] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <IconBox>
                <PinIcon />
              </IconBox>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Our Office
                </h3>
                <p className="mt-2 text-slate-600 leading-7">
                  Villa 105 | D2 Street | The Classia Khang Dien |<br />
                 
                  Ho Chi Minh City, Vietnam
                </p>
                <a
                  href="#"
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Contact methods */}
          

          {/* Business Hours */}
          <div className="rounded-2xl bg-white [box-shadow:rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.06)_0px_1px_2px_0px] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <IconBox>
                <ClockIcon />
              </IconBox>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Business Hours
                </h3>

                <ul className="mt-3 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#DBEAFE]" />
                    <div className="text-slate-600">
                      Monday – Friday: 8:00 AM – 6:00 PM
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#DBEAFE]" />
                    <div className="text-slate-600">
                      Saturday: 8:00 AM – 12:00 PM
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#DBEAFE]" />
                    <div className="text-slate-600">Sunday: Closed</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetinTouch;
