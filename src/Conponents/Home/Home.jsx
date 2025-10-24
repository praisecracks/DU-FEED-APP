// src/Pages/Home/Home.jsx
import Footer from "../../Containers/Footer/Footer";
import Header from "../../Containers/Header/Header";
import ReportContainer from "./ReportContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Content Wrapper */}
      <main className="pt-28 px-4 sm:px-6 md:px-8">
        <section className="max-w-7xl mx-auto space-y-10">
          {/* Hero Intro */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Welcome to Dominion University Feed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Stay Updated. Stay Connected. News, Events, and More — All in One Place.
            </p>
          </div>

          {/* Reports Feed */}
          <ReportContainer />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
