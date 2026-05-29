import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Certificates() {

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/certificates"
      );

      setCertificates(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-center mb-10">
        All Certificates
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {certificates.map((item) => (

          <div
            key={item._id}
            className="bg-zinc-900 rounded-3xl overflow-hidden shadow-xl"
          >

            <img
              src={item.image}
              alt="certificate"
              className="h-64 w-full object-cover"
            />

            <div className="p-6">

              <h2 className="text-2xl font-bold mb-2">
                {item.customerName}
              </h2>

              <p className="mb-2">
                {item.certificateId}
              </p>

              <p className="mb-4">
                {item.jewelryType}
              </p>

              <Link
                to={`/certificate/${item.certificateId}`}
                className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-bold"
              >
                Verify
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}