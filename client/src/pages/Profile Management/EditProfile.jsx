import React, { useContext, useEffect, useState } from "react";
import LOGO from "../../assets/Logo.png";
import bg from "../../assets/gym.jpg";
import { AuthContext } from "../../shared/context/auth.context";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import Toast from "../../shared/toast/Toast";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userID } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [nicError, setNicError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);
      setLoading(true);
      Toast("Uploading image...", "info");
      try {
        const snapshot = await fileRef.put(selectedFile);
        const url = await snapshot.ref.getDownloadURL();
        setImage(url);
        Toast("Image uploaded successfully", "success");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No file selected");
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/quiz/${userID}`
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userID]);

  useEffect(() => {
    setFullName(data?.userID?.details?.fullName || "");
    setAge(data.age || "");
    setNic(data.NIC || "");
    setPhone(data.tele || "");
  }, [data]);

  const isSaveEnabled =
    fullName !== "" &&
    nic !== "" &&
    phone !== "" &&
    !isNaN(parseInt(phone)) &&
    !isNaN(parseInt(nic))&&
    nic.length === 13 &&
    phone.length === 10; 


  const handleSave = async () => {
    if (isSaveEnabled) {
      try {
        axios.put(`http://localhost:3000/api/quiz/${userID}`, {
          QandA: {
            QuizId: data._id,
            fullName: fullName,
            userId: data.userID._id,
            age: age,
            NIC: nic,
            tele: phone,
          },
        });
        Toast("Profile updated Successfully","success")
        navigate("/profile");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    } else {
      alert("Please fill in all fields with valid values before saving.");
    }
  };

  const handleAgeGroupChange = (event) => {
    setAge(event.target.value);
  };

  const handleNicChange = (e) => {
    const value = e.target.value;
    setNic(value);
    if (!/^\d{13}$/.test(value)) {
      setNicError("NIC must be 13 digits");
    } else {
      setNicError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (!/^\d{10}$/.test(value)) {
      setPhoneError("Phone number must be 10 digits");
    } else {
      setPhoneError("");
    }
  };

  return (
    <div className="bg-gray-200">
      <img
        src={bg}
        alt="background"
        className="absolute inset-0 object-cover w-full h-screen opacity-80 grayscale brightness-50"
      />
      <div className="p-5 relative">
        <img
          src={LOGO}
          alt="logo"
          className="absolute top-0 left-0 h-10 mt-2 ml-5 "
        />
        <div className="mt-10">
          <h1 class="text-xl font-bold text-white capitalize dark:text-white">
            Edit Profile
          </h1>

          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            {loading ? (
              <div> ...Loading </div>
            ) : (
              <>
                <div>
                  <label class="text-white dark:text-gray-200" for="username">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    id="fullName"
                    type="text"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label
                    class="text-white dark:text-gray-200"
                    for="passwordConfirmation"
                  >
                    Select Your Age
                  </label>
                  <select
                    value={age}
                    onChange={handleAgeGroupChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  >
                    <option value="18 - 29">18-29</option>
                    <option value="30 - 39">30-39</option>
                    <option value="40 - 49">40-49</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
                <div>
                  <label
                    class="text-white dark:text-gray-200"
                    for="emailAddress"
                  >
                    NIC
                  </label>
                  <input
                    value={nic}
                    onChange={handleNicChange}
                    id="nic"
                    type="text"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                  {nicError && (
                <p className="text-red-500 text-xs mt-1">{nicError}</p>
              )}
                </div>

                <div>
                  <label class="text-white dark:text-gray-200" for="password">
                    Telephone
                  </label>
                  <input
                    value={phone}
                    onChange={handlePhoneChange}
                    id="phone"
                    type="text"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                {phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
                </div>
                <div>
                  <label class="block text-sm font-medium text-white">
                    Profile Picture
                  </label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div class="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-white"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div class="flex text-sm text-gray-600">
                        <label
                          for="file-upload"
                          class="relative cursor-pointer u font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span class="">Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            onChange={handleFileUpload}
                            class="sr-only"
                          />
                        </label>
                        <p class="pl-1 text-white">or drag and drop</p>
                      </div>
                      <p class="text-xs text-white">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div class="flex justify-end mt-6">
            <button
              class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 focus:outline-none focus:bg-gray-600"
              onClick={handleSave}
              disabled={!isSaveEnabled}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="text-center bg-white bg-opacity-50 p-2 absolute bottom-0 left-0 w-full">
        <p className="text-black">Copyright© All rights Reserved.</p>
      </div>
    </div>
  );
};

export default UserProfile;
