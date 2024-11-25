"use client";

import { useState } from "react";

export default function MyDocuments() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Beachfront Villa",
      image: "/images/villa.jpg",
      documents: [
        { id: 1, name: "Contract.pdf", date: "2024-11-01", size: "1.2 MB" },
        { id: 2, name: "Blueprint.pdf", date: "2024-10-25", size: "850 KB" },
      ],
    },
    {
      id: 2,
      name: "Downtown Apartment",
      image: "/images/apartment.jpg",
      documents: [
        { id: 3, name: "Lease_Agreement.pdf", date: "2024-10-20", size: "600 KB" },
        { id: 4, name: "Maintenance_Report.pdf", date: "2024-10-15", size: "400 KB" },
      ],
    },
  ]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  const handlePropertySelect = (propertyId: number) => {
    setSelectedProperty(propertyId);
  };

  const handleDownload = (documentName: string) => {
    alert(`Downloading ${documentName}`);
  };

  const handleDelete = (propertyId: number, documentId: number) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === propertyId
          ? {
              ...property,
              documents: property.documents.filter((doc) => doc.id !== documentId),
            }
          : property
      )
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && selectedProperty) {
      const newDocument = {
        id: Date.now(),
        name: file.name,
        date: new Date().toISOString().split("T")[0],
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === selectedProperty
            ? {
                ...property,
                documents: [...property.documents, newDocument],
              }
            : property
        )
      );
    }
  };

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>

      {!selectedProperty ? (
        // Property selection view
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="cursor-pointer p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
              onClick={() => handlePropertySelect(property.id)}
            >
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold">{property.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        // Document list view for selected property
        <div>
          <button
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => setSelectedProperty(null)}
          >
            Back to Properties
          </button>

          <h2 className="text-xl font-bold mb-4">
            Documents for{" "}
            {properties.find((property) => property.id === selectedProperty)?.name}
          </h2>

          {/* File upload section */}
          <div className="mb-4 flex items-center gap-2">
            <label className="px-4 py-2 bg-gray-200 text-center rounded-md hover:bg-gray-300 cursor-pointer">
              Choose File
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Document Name</th>
                  <th className="px-4 py-2 text-left">Upload Date</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties
                  .find((property) => property.id === selectedProperty)
                  ?.documents.map((document) => (
                    <tr key={document.id} className="border-t">
                      <td className="px-4 py-2">{document.name}</td>
                      <td className="px-4 py-2">{document.date}</td>
                      <td className="px-4 py-2">{document.size}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          className="px-2 py-1 text-blue-500 hover:underline"
                          onClick={() => handleDownload(document.name)}
                        >
                          Download
                        </button>
                        <button
                          className="px-2 py-1 text-red-500 hover:underline ml-2"
                          onClick={() =>
                            handleDelete(selectedProperty, document.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}