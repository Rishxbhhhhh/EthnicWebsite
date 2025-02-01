import React from "react";
import Sidebar from "../Admin";

const Settings = () => {
  return (
    <div>
     
      <h2>Settings</h2>
      <div>
        {/* You can add form fields for updating admin settings */}
        <div>
          <label>Site Title</label>
          <input type="text" />
        </div>
        <div>
          <label>Site Logo</label>
          <input type="file" />
        </div>
        <button>Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;
