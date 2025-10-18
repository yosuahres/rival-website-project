"use client";

import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset form state
    setFormState({
      isLoading: true,
      isSuccess: false,
      error: null,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      // Success
      setFormState({
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setFormState({
        isLoading: false,
        isSuccess: false,
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  return (
    <div className="bg-white/0 backdrop-blur-sm rounded-lg p-8 ">
      {formState.isSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-white rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <title>Success Icon</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Message sent successfully!</span>
          </div>
          <p className="mt-1 text-sm">
            Thank you for contacting us. We'll get back to you soon.
          </p>
        </div>
      )}

      {formState.error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <title>Error Icon</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Error: {formState.error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-white text-sm font-medium mb-2"
            >
              First Name <span className="text-red-500">(required)</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f4e] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="First Name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-white text-sm font-medium mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={formState.isLoading}
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f4e] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-white text-sm font-medium mb-2"
          >
            Email <span className="text-red-500">(required)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={formState.isLoading}
            className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f4e] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Email"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-white text-sm font-medium mb-2"
          >
            Message <span className="text-red-500">(required)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={formState.isLoading}
            className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1e5f4e] focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Message"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={formState.isLoading}
          className="bg-black hover:bg-[#16473a] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1e5f4e] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
        >
          {formState.isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>Loading Spinner</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
