import React from "react";

export function PlayerForm({ onPlayerID, connecting }) {
  // For the text input field.
  const urlParams = new URLSearchParams(window.location.search);
  const playerID = urlParams.get("participantKey") || "";

  // Handling the player submitting their ID.
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!playerID || playerID.trim() === "") {
      alert("This is not a valid URL. Please contact the researcher.");
      return;
    }
    onPlayerID(playerID);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to our study!
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <fieldset disabled={connecting}>
              <div>
                <div className="mt-1">
                  <p className="my-2 text-sm text-gray-500">
                    <b>Please start the task as soon as possible</b>, or the study slot may be closed!
                  </p>
                  <p className="my-2 text-sm text-gray-500">
                    If you can't start the task right now, please leave this page and return the study on Prolific.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-empirica-600 hover:bg-empirica-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
                >
                  Enter
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}