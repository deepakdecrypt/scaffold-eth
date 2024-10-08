"use client";

import { useEffect, useState } from "react";
// Import useState
import Link from "next/link";
import type { NextPage } from "next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Import the CSS for styling

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const [inputValue, setInputValue] = useState(""); // State for input value
  const [loading, setLoading] = useState(false); // State for button loading

  const [userData, setUserData] = useState<any[]>([]);

  const fetchUserData = async () => {
    if (!connectedAddress) return;

    const response = await fetch(`/api/getinfo`);
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    fetchUserData();
  }, [connectedAddress]);

  // Function to handle save action
  const handleSave = async () => {
    if (!connectedAddress || !inputValue) return; // Validate input

    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/saveinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: connectedAddress,
          data: inputValue, // Data to save
        }),
      });
      if (response.ok) {
        toast.success("Data saved successfully!"); // Show success toast
      } else {
        toast.error("Failed to save data."); // Show error toast
      }
    } catch (error) {
      toast.error("Error saving data"); // Show error toast
      console.error("Error saving data:", error);
    } finally {
      setInputValue("");
      fetchUserData();
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Blockchain Australia</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        {connectedAddress && (
          <>
            <div className="mt-4">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)} // Update state
                placeholder="Enter your content..."
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <button
              onClick={handleSave}
              className={`btn mt-4 ${loading ? "btn-disabled" : ""}`} // Disable when loading
              disabled={loading} // Prevent multiple clicks
            >
              {loading ? "Saving..." : "Save"}
            </button>

            {Array.isArray(userData) && userData.length > 0 && (
              <>
                <div className="mt-8">
                  <h2 className="text-xl">Book Content</h2>
                  <div className="overflow-auto h-60 border border-gray-300 rounded-md">
                    <ul className="p-2">
                      {userData.map((item, index) => (
                        <li key={index} className="py-1">
                          Address: {item.address}, Content: {item.data}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8">
              <button
                className="btn btn-primary mt-4"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "mint",
                      args: [connectedAddress],
                    });
                    toast.success("Book Published"); // Show success toast
                  } catch (e) {
                    toast.error("Error saving data");
                    console.error("Error setting greeting:", e);
                  }
                }}
              >
                Mint
              </button>
            </div>
          </>
        )}
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
