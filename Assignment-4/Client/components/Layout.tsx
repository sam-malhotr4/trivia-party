import React from 'react';

const Layout: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center mt-auto">
      &copy; {new Date().getFullYear()} Trivia Party. All rights reserved.
    </footer>
  );
};

export default Layout;
